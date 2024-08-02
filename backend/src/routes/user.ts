import { Hono } from "hono";
import { getPrisma } from "../../lib/prisma";
import { getCookie, setCookie } from "hono/cookie";
import { Jwt } from "hono/utils/jwt";
import { verify } from "hono/jwt";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

type Variables = {
  userId: number;
};

const user = new Hono<{ Bindings: Bindings; Variables: Variables }>();

user.post("/signup", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.formData();
  const username = body.get("username") as string;
  const name = body.get("name") as string;
  const password = body.get("password") as string;

  if (!username) {
    return c.json({ message: "username is required" });
  }

  if (!password) {
    return c.json({ message: "password is required" });
  }

  const existingUsername = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (existingUsername) {
    return c.json({ message: "username already exists" });
  }

  const res = await prisma.user.create({
    data: {
      username: username,
      name: name || null,
      password: password,
    },
  });
  c.status(301);

  return c.json({ message: "regestered successfully", res });
});

user.post("/signin", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.formData();
  const username = body.get("username") as string;
  const password = body.get("password") as string;

  if (!username) {
    return c.json({ message: "username is required" });
  }

  if (!password) {
    return c.json({ message: "password is required" });
  }

  const user = await prisma.user.findFirst({
    where: {
      password: password,
      username: username,
    },
  });
  if (!user) {
    return c.json({ message: "Wrong credentials" });
  }

  const token = await Jwt.sign({ id: user.id }, c.env.JWT_SECRET);

  setCookie(c, "token", token, {
    maxAge: 34560000,
  });

  c.status(200);

  return c.json({ message: "regestered successfully", user });
});

user.use("*", async (c, next) => {
  const authHeader = getCookie(c, "token");
  if (!authHeader) {
    c.status(401);
    return c.json({ message: "Please log in" });
  }
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user.id) {
      console.log("Authenticated user ID:", user.id);
      c.set("userId", Number(user.id));
      await next();
    } else {
      return c.json({ message: "You are not logged in" }, 403);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ message: "Authentication failed" }, 403);
  }
});

user.get("/profile", (c) => {
  const userId = c.get("userId");
  const user = getPrisma(c.env.DATABASE_URL).user.findUnique({
    select: {
      name: true,
      username: true,
    },
    where: {
      id: Number(userId),
    },
  });
  return c.text(`Hello, Pratham! Your user ID is ${userId}`); // eslint-disable-line
});

export default user;

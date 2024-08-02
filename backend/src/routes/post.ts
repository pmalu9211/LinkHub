import { Hono } from "hono";
import { getPrisma } from "../../lib/prisma";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

interface Bindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface Variables {
  userId: number;
}

const post = new Hono<{ Bindings: Bindings; Variables: Variables }>();

post.get("/posts", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const res = await prisma.post.findMany();
  return c.json({ message: "Hello Hono!", res });
});

post.use("*", async (c, next) => {
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

post.post("/upload", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  // const body = await c.req.parseBody();
  const body = await c.req.formData();
  const title = body.get("title") as string;
  const link = body.get("link") as string;
  const userId = c.get("userId");

  console.log(body);

  if (!title) {
    return c.json({ message: "title is required" });
  }
  if (!link) {
    return c.json({ message: "link is required" });
  }

  try {
    const res = await prisma.post.create({
      data: {
        title: title,
        link: link,
        userId: Number(userId),
      },
    });
    return c.json({ message: "Hello Hono!", res });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ message: "went wrong" });
  }
});

post.post("/upvote", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  const Sid = body.id as string;
  const id = Number(Sid);

  console.log(body);

  if (!id) {
    return c.json({ message: " invalid id input" });
  }

  const res = await prisma.post.findFirst({
    where: {
      id,
    },
  });

  if (!res) {
    return c.json({ message: "post not found" });
  }

  const voted = await prisma.vote.findFirst({
    where: {
      postId: id,
      userId: c.get("userId"),
    },
  });
  let data;
  if (voted) {
    data =
      voted?.value === 1
        ? await prisma.vote.delete({ where: { id: voted.id } })
        : await prisma.vote.update({
            where: { id: voted.id },
            data: { value: 1 },
          });
  } else {
    data = await prisma.vote.create({
      data: {
        postId: id,
        userId: c.get("userId"),
        value: 1,
      },
    });
  }

  try {
    return c.json({ message: "Hello Hono!", data });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ message: "went wrong" });
  }
});

post.post("/downvote", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  const Sid = body.id as string;
  const id = Number(Sid);

  console.log(body);

  if (!id) {
    return c.json({ message: " invalid id input" });
  }

  const res = await prisma.post.findFirst({
    where: {
      id,
    },
  });

  if (!res) {
    return c.json({ message: "post not found" });
  }

  const voted = await prisma.vote.findFirst({
    where: {
      postId: id,
      userId: c.get("userId"),
    },
  });
  let data;
  if (voted) {
    data =
      voted?.value === -1
        ? await prisma.vote.delete({ where: { id: voted.id } })
        : await prisma.vote.update({
            where: { id: voted.id },
            data: { value: -1 },
          });
  } else {
    data = await prisma.vote.create({
      data: {
        postId: id,
        userId: c.get("userId"),
        value: -1,
      },
    });
  }

  try {
    return c.json({ message: "Downvoted", data });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ message: "Something went wrong" });
  }
});

export default post;

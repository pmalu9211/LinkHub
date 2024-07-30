import { Hono } from "hono";
import { getPrisma } from "../lib/prisma";

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.post("api/v1/post", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  // const body = await c.req.parseBody();
  const body = await c.req.formData();
  const title = body.get("title") as string;
  const link = body.get("link") as string;

  console.log(body);

  if (!title) {
    return c.text("title is required");
  }
  if (!link) {
    return c.text("link is required");
  }

  try {
    const res = await prisma.post.create({
      data: { title: title, link: link },
    });
    return c.json({ message: "Hello Hono!", res });
  } catch (e) {
    console.log(e);
    return c.text("!");
  }
});

export default app;

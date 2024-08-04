import { Hono } from "hono";
import user from "./routes/user";
import { cors } from "hono/cors";
import post from "./routes/post";

const app = new Hono();

app.use(
  cors({
    origin: "https://linkhub-khaki.vercel.app/",
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("api/v1/user", user);
app.route("api/v1/post", post);

export default app;

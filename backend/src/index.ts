import { Hono } from "hono";
import user from "./routes/user";
import { cors } from "hono/cors";
import post from "./routes/post";

const app = new Hono();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.route("api/v1/user", user);
app.route("api/v1/post", post);

export default app;

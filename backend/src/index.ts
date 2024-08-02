import { Hono } from "hono";
import user from "./routes/user";
import { cors } from "hono/cors";
import post from "./routes/post";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
  })
);

app.route("api/v1/user", user);
app.route("api/v1/post", post);

export default app;

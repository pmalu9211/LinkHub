import { Hono } from "hono";
import user from "./routes/user";
import { cors } from "hono/cors";
import post from "./routes/post";

const app = new Hono();

app.use(
  cors({
    origin: "https://linkhub-khaki.vercel.app",
    allowMethods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello pratham!");
});

app.route("api/v1/user", user);
app.route("api/v1/post", post);

export default app;

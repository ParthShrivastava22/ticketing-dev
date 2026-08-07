import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/currentUser.js";
import { signinRouter } from "./routes/signin.js";
import { signoutRouter } from "./routes/signout.js";
import { signupRouter } from "./routes/signup.js";
import { errorHandler } from "./middleware/error-handler.js";
import { NotFoundError } from "./errors/not-found-error.js";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("/{*splat}", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

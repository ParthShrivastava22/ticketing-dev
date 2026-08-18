import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@digitalassetps/common";
import { createAssetRouter } from "./routes/new";
import { showAssetRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateAssetRouter } from "./routes/update";

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

app.use(currentUser);
app.use(createAssetRouter);
app.use(showAssetRouter);
app.use(indexRouter);
app.use(updateAssetRouter);

app.all("/{*splat}", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

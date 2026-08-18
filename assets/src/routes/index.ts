import express from "express";
import type { Request, Response } from "express";
import { Asset } from "../models/asset";

const router = express.Router();

router.get("/api/assets", async (req: Request, res: Response) => {
  const assets = await Asset.find({});

  res.send(assets);
});

export { router as indexRouter };

import express from "express";
import type { Request, Response } from "express";
import { Asset } from "../models/asset";
import { NotFoundError } from "@digitalassetps/common";

const router = express.Router();

router.get("/api/assets/:id", async (req: Request, res: Response) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) throw new NotFoundError();

  res.status(201).send(asset);
});

export { router as showAssetRouter };

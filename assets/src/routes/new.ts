import express from "express";
import type { Request, Response } from "express";
import { requireAuth, validateRequest } from "@digitalassetps/common";
import { z } from "zod";
import { Asset } from "../models/asset";

const router = express.Router();

const bodySchema = z.object({
  title: z.string().trim().min(1, { message: "Title cannot be empty" }),
  price: z.number().nonnegative(),
});

router.post(
  "/api/assets",
  requireAuth,
  validateRequest(bodySchema),
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const asset = Asset.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await asset.save();

    res.status(201).send(asset);
  },
);

export { router as createAssetRouter };

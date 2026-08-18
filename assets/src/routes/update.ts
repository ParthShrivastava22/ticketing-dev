import express from "express";
import type { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
} from "@digitalassetps/common";
import { z } from "zod";
import { Asset } from "../models/asset";

const bodySchema = z.object({
  title: z.string().trim().min(1, { message: "Title cannot be empty" }),
  price: z.number().nonnegative(),
});

const router = express.Router();

router.put(
  "/api/assets/:id",
  requireAuth,
  validateRequest(bodySchema),
  async (req: Request, res: Response) => {
    const asset = await Asset.findById(req.params.id);

    if (!asset) throw new NotFoundError();

    if (asset.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    asset.set({
      title: req.body.title,
      price: req.body.price,
    });

    await asset.save();

    res.status(201).send(asset);
  },
);

export { router as updateAssetRouter };

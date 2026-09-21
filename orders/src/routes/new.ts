import { Types } from "mongoose";
import express from "express";
import type { Request, Response } from "express";
import { requireAuth, validateRequest } from "@digitalassetps/common";
import { z } from "zod";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const bodySchema = z.object({
  assetId: z
    .string()
    .trim()
    .refine((input) => Types.ObjectId.isValid(input), {
      message: "Invalid Asset ID format",
    }),
});

router.post(
  "/api/assets",
  requireAuth,
  validateRequest(bodySchema),
  async (req: Request, res: Response) => {
    res.send({});
  },
);

export { router as newOrderRouter };

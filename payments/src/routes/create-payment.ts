import express from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
} from "@digitalassetps/common";

import { Order } from "../models/order";

const router = express.Router();

const bodySchema = z.object({
  orderId: z.string().trim().min(1, {
    message: "Order ID cannot be empty",
  }),
});

router.post(
  "/api/payments",
  requireAuth,
  validateRequest(bodySchema),
  (req, res) => {
    const [orderId] = req.body;

    res.send({ success: true });
  },
);

export { router as createPaymentRouter };

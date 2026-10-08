import express from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
} from "@digitalassetps/common";
import { Order, OrderStatus } from "../models/order";

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
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("The order is cancelled, can't pay for it");

    res.send({ success: true });
  },
);

export { router as createPaymentRouter };

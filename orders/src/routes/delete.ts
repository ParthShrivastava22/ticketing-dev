import express from "express";
import type { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@digitalassetps/common";
import { Order, OrderStatus } from "../models/order";
import { Types } from "mongoose";

const router = express.Router();

router.delete(
  `/api/orders/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // Tell TypeScript to treat orderId strictly as a string
    if (!Types.ObjectId.isValid(orderId as string)) {
      throw new BadRequestError("Invalid Order id");
    }

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send(order);
  },
);

export { router as deleteOrderRouter };

import express from "express";
import type { Request, Response } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@digitalassetps/common";
import { Order } from "../models/order";
import { Types } from "mongoose";

const router = express.Router();

router.get(
  `/api/orders/:orderId`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // Tell TypeScript to treat orderId strictly as a string
    if (!Types.ObjectId.isValid(orderId as string)) {
      throw new BadRequestError("Invalid Order id");
    }

    const order = await Order.findById(orderId).populate("asset");
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    // Publish an event that order was cancelled

    res.status(200).send(order);
  },
);

export { router as showOrderRouter };

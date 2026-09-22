import express from "express";
import type { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "@digitalassetps/common";
import { Order, OrderStatus } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
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

    const order = await Order.findById(orderId).populate("asset");
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    const js = natsWrapper.client;
    const publisher = new OrderCancelledPublisher(js);

    await publisher.publish({
      id: order.id,
      asset: {
        id: order.asset.id,
      },
    });
    res.status(204).send(order);
  },
);

export { router as deleteOrderRouter };

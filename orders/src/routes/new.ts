import { Types } from "mongoose";
import express from "express";
import type { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@digitalassetps/common";
import { z } from "zod";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";
import { Asset } from "../models/asset";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const EXPIRATION_WINDOW_SECONDS = 6 * 60;

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
  "/api/orders",
  requireAuth,
  validateRequest(bodySchema),
  async (req: Request, res: Response) => {
    const { assetId } = req.body;

    // Find the asset user is trying to order in the database
    const asset = await Asset.findById(assetId);
    if (!asset) throw new NotFoundError();

    // Make sure asset isn't already reserved
    const assetIsReserved = await asset.isReserved();
    if (assetIsReserved)
      throw new BadRequestError("The asset is already reserved");

    // Calculate an expiration date/time for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      asset,
    });

    await order.save();

    // Publish an order.created event
    const js = natsWrapper.client;
    const publisher = new OrderCreatedPublisher(js);

    await publisher.publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: order.userId,
      asset: {
        id: asset.id,
        price: asset.price,
      },
      expiresAt: order.expiresAt.toISOString(),
    });

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };

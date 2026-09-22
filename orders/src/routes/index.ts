import express from "express";
import type { Request, Response } from "express";
import { Order } from "../models/order";
import { requireAuth } from "@digitalassetps/common";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("asset");

  res.send(orders);
});

export { router as indexRouter };

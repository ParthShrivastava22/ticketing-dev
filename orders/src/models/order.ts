import mongoose from "mongoose";
import { OrderStatus } from "@digitalassetps/common";
import type { AssetDoc } from "./asset";

// Interface describing properties required to create a new order
interface OrderAttrs {
  userId: string;
  asset: AssetDoc;
  expiresAt: Date;
  status: OrderStatus;
}

// Interface describing properties that the Order Document has
interface OrderDoc extends mongoose.Document {
  userId: string;
  asset: AssetDoc;
  expiresAt: Date;
  status: OrderStatus;
  id: string;
}

// Interface describing properties that the Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const orderRet = ret as {
          _id?: unknown;
          __v?: number;
          id?: unknown;
        };

        orderRet.id = orderRet._id;
        delete orderRet._id;
        delete orderRet.__v;
      },
    },
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };

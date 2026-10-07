import mongoose from "mongoose";
import { OrderStatus } from "@digitalassetps/common";

// Interface describing properties required to create a new order
interface OrderAttrs {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

// Interface describing properties that the Order Document has
interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
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
    status: {
      type: String,
      require: true,
      enum: Object.values(OrderStatus),
    },
    price: {
      type: Number,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const orderRet = ret as {
          _id?: unknown;
          id?: unknown;
        };

        orderRet.id = orderRet._id;
        delete orderRet._id;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  },
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };

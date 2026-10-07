import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { JsMsg } from "nats";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@digitalassetps/common";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    asset: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 30,
    },
    expiresAt: "inshallah",
  };

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { message, data, listener };
};

it("replicates the order info", async () => {
  const { message, data, listener } = await setup();
  await listener.onMessage(data, message);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.asset.price);
});

it("acknowledges the message", async () => {
  const { message, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

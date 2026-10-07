import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { JsMsg } from "nats";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@digitalassetps/common";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 30,
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    asset: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { message, data, listener, order };
};

it("updates the order status to cancelled", async () => {
  const { message, data, listener } = await setup();

  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowledges the message", async () => {
  const { message, data, listener } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("throws an error if the order does not exist", async () => {
  const { message, listener } = await setup();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    asset: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  await expect(listener.onMessage(data, message)).rejects.toThrow();
});

it("throws an error if the order version is incorrect", async () => {
  const { message, data, listener } = await setup();

  const incorrectVersionData: OrderCancelledEvent["data"] = {
    ...data,
    version: data.version + 1,
  };

  await expect(
    listener.onMessage(incorrectVersionData, message),
  ).rejects.toThrow();
});

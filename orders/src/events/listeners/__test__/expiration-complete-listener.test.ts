import { ExpirationCompleteListener } from "../expiration-complete-listener";
import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
} from "@digitalassetps/common";
import { Asset } from "../../../models/asset";
import { Order, OrderStatus } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { JsMsg, JSONCodec } from "nats";

const setup = async () => {
  const listener = new ExpirationCompleteListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const asset = Asset.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Action animations",
    price: 25,
  });
  await asset.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    asset,
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, message, asset, order };
};

it("updates order status to cancelled", async () => {
  const { message, asset, order, data, listener } = await setup();
  await listener.onMessage(data, message);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const { message, asset, order, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const js = JSONCodec();
  const orderCancelledData = js.decode(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  ) as OrderCancelledEvent["data"];

  expect(order.id).toEqual(orderCancelledData.id);
});

it("acknowledges the message", async () => {
  const { message, asset, order, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

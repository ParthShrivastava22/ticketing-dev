import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@digitalassetps/common";
import { Asset } from "../../../models/asset";
import { JsMsg } from "nats";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const asset = Asset.build({
    title: "Action animations",
    price: 25,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await asset.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    asset: {
      id: asset.id,
      price: asset.price,
    },
    expiresAt: "inshallah",
  };

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, message, asset };
};

it("sets userId for the asset", async () => {
  const { message, asset, data, listener } = await setup();
  await listener.onMessage(data, message);

  const updatedAsset = await Asset.findById(asset.id);

  expect(updatedAsset!.orderId).toBeDefined();
  expect(updatedAsset!.orderId).not.toBeNull();
  expect(updatedAsset!.orderId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  const { message, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

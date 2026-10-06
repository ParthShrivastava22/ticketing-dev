import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@digitalassetps/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Asset } from "../../../models/asset";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderCancelledListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const asset = Asset.build({
    title: "Action animations",
    price: 25,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await asset.save();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    asset: {
      id: asset.id,
    },
  };

  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, message, asset };
};

it("updates the asset", async () => {
  const { message, asset, data, listener } = await setup();
  await listener.onMessage(data, message);

  const updatedAsset = await Asset.findById(asset.id);

  expect(updatedAsset!.orderId).not.toBeDefined();
});

it("acknowledges the message", async () => {
  const { message, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("publishes an event", async () => {
  const { message, data, listener } = await setup();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

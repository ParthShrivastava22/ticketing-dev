import { AssetUpdatedListener } from "../asset-updated-listener";
import { AssetUpdatedEvent } from "@digitalassetps/common";
import { Asset } from "../../../models/asset";
import { natsWrapper } from "../../../nats-wrapper";
import { JsMsg } from "nats";
import mongoose from "mongoose";

const setup = async () => {
  // create a listener
  const listener = new AssetUpdatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  // create and save an asset
  const asset = Asset.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Action animations",
    price: 25,
  });
  await asset.save();

  // create a fake data object
  const data: AssetUpdatedEvent["data"] = {
    id: asset.id,
    title: "Movement animations",
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: asset.version + 1,
    orderId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  // return all of the above
  return { listener, data, message, asset };
};

it("finds, updates and saves an asset", async () => {
  const { message, asset, data, listener } = await setup();

  await listener.onMessage(data, message);

  const updatedAsset = await Asset.findById(asset.id);

  expect(updatedAsset).not.toBeNull();
  expect(updatedAsset).toBeDefined();
  expect(updatedAsset!.id).toEqual(asset.id);
  expect(updatedAsset!.title).toEqual(data.title);
  expect(updatedAsset!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { message, data, listener } = await setup();

  // call the onMessage function with fake data and message objects
  await listener.onMessage(data, message);

  // write assertions to make sure ack function is called
  expect(message.ack).toHaveBeenCalled();
});

it("doesn't acknowledge events that are out of order", async () => {
  const { message, data, listener } = await setup();

  data.version = 10;

  await expect(listener.onMessage(data, message)).rejects.toThrow();
});

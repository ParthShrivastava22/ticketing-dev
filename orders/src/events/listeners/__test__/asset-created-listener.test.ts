import { AssetCreatedListener } from "../asset-created-listener";
import { AssetCreatedEvent } from "@digitalassetps/common";
import { Asset } from "../../../models/asset";
import { natsWrapper } from "../../../nats-wrapper";
import { JsMsg } from "nats";
import mongoose from "mongoose";

const setup = async () => {
  // create an instance of a listener
  const listener = new AssetCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  // create a fake data event
  const data: AssetCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Action animations",
    price: 25,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: JsMsg = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("creates and saves an asset", async () => {
  const { listener, data, message } = await setup();

  // call the onMessage function with fake data and message objects
  await listener.onMessage(data, message);

  // write assertions to make sure an asset was created
  const asset = await Asset.findById(data.id);

  expect(asset).not.toBeNull();
  expect(asset).toBeDefined();
  expect(asset!.title).toEqual(data.title);
  expect(asset!.price).toEqual(data.price);
});

it("acknowledges the message", async () => {
  const { listener, data, message } = await setup();

  // call the onMessage function with fake data and message objects
  await listener.onMessage(data, message);

  // write assertions to make sure ack function is called
  expect(message.ack).toHaveBeenCalled();
});

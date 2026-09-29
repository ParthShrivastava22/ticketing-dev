import {
  Listener,
  AssetCreatedEvent,
  Subjects,
  Streams,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Asset } from "../../models/asset";

export class AssetCreatedListener extends Listener<AssetCreatedEvent> {
  subject: Subjects.AssetCreated = Subjects.AssetCreated;
  streamName = Streams.Asset;
  consumerName = "order-service-asset-created";

  async onMessage(data: AssetCreatedEvent["data"], message: JsMsg) {
    const { id, title, price } = data;
    const asset = Asset.build({ id, title, price });
    await asset.save();

    message.ack();
  }
}

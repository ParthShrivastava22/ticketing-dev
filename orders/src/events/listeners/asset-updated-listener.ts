import {
  Listener,
  AssetUpdatedEvent,
  Subjects,
  Streams,
  NotFoundError,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Asset } from "../../models/asset";

export class AssetUpdatedListener extends Listener<AssetUpdatedEvent> {
  subject: Subjects.AssetUpdated = Subjects.AssetUpdated;
  streamName = Streams.Asset;
  consumerName = "order-service-asset-updated";

  async onMessage(data: AssetUpdatedEvent["data"], message: JsMsg) {
    const { id, title, price } = data;

    const asset = await Asset.findById(id);
    if (!asset) throw new NotFoundError();

    asset.set({ title, price });
    await asset.save();

    message.ack();
  }
}

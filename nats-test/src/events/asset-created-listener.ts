import { Listener } from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { AssetCreatedEvent } from "@digitalassetps/common";
import { Subjects, Streams } from "@digitalassetps/common";

export class AssetCreatedListener extends Listener<AssetCreatedEvent> {
  subject: Subjects.AssetCreated = Subjects.AssetCreated;
  streamName = Streams.Asset;
  consumerName = "asset-service-listener";

  async onMessage(data: AssetCreatedEvent["data"], message: JsMsg) {
    console.log("Event data: ", data);
  }
}

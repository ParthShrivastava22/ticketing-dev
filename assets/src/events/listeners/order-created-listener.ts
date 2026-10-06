import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  Streams,
  NotFoundError,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Asset } from "../../models/asset";
import { AssetUpdatedPublisher } from "../publishers/asset-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = Streams.Order;
  consumerName = "asset-service-order-created";

  async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
    const asset = await Asset.findById(data.asset.id);
    if (!asset) throw new NotFoundError();

    asset.set({ orderId: data.id });
    await asset.save();
    await new AssetUpdatedPublisher(this.js).publish({
      id: asset.id,
      title: asset.title,
      price: asset.price,
      userId: asset.userId,
      orderId: asset.orderId,
      version: asset.version,
    });

    message.ack();
  }
}

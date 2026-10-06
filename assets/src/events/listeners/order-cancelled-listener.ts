import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  Streams,
  NotFoundError,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Asset } from "../../models/asset";
import { AssetUpdatedPublisher } from "../publishers/asset-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  streamName = Streams.Order;
  consumerName = "asset-service-order-cancelled";

  async onMessage(data: OrderCancelledEvent["data"], message: JsMsg) {
    const asset = await Asset.findById(data.asset.id);
    if (!asset) throw new NotFoundError();

    asset.set({ orderId: undefined });
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

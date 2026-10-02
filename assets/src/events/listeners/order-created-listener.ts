import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  Streams,
  NotFoundError,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Asset } from "../../models/asset";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = Streams.Order;
  consumerName = "asset-service-order-created";

  async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
    const asset = await Asset.findById(data.asset.id);
    if (!asset) throw new NotFoundError();

    asset.set({ orderId: data.id });
    await asset.save();

    message.ack();
  }
}

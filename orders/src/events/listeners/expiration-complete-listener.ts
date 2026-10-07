import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  Streams,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Order, OrderStatus } from "../../models/order";
import { NotFoundError } from "@digitalassetps/common";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  streamName: Streams.Expiration = Streams.Expiration;
  consumerName = "order-service-expiration-complete";

  async onMessage(data: ExpirationCompleteEvent["data"], message: JsMsg) {
    const order = await Order.findById(data.orderId).populate("asset");
    if (!order) throw new NotFoundError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    const publisher = new OrderCancelledPublisher(this.js);
    await publisher.publish({
      id: order.id,
      asset: {
        id: order.asset.id,
      },
      version: order.version,
    });

    message.ack();
  }
}

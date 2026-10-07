import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  Streams,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = Streams.Order;
  consumerName = "payment-service-order-created";

  async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
    const { id, userId, status, version, asset } = data;
    const order = Order.build({
      id,
      userId,
      version,
      status,
      price: asset.price,
    });

    await order.save();

    message.ack();
  }
}

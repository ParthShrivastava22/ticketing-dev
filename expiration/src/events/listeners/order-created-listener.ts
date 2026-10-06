import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  Streams,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = Streams.Order;
  consumerName = "expiration-service-order-created";

  async onMessage(data: OrderCreatedEvent["data"], message: JsMsg) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Waiting for ", delay, "ms");

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      },
    );

    message.ack();
  }
}

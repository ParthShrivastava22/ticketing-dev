import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  Streams,
  NotFoundError,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Order, OrderStatus } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  streamName = Streams.Payment;
  consumerName = "order-service-payment-created";

  async onMessage(data: PaymentCreatedEvent["data"], message: JsMsg) {
    const order = await Order.findById(data.orderId);
    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    message.ack();
  }
}

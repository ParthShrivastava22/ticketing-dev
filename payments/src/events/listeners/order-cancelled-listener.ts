import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  Streams,
  NotFoundError,
  OrderStatus,
} from "@digitalassetps/common";
import type { JsMsg } from "nats";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  streamName = Streams.Order;
  consumerName = "payment-service-order-cancelled";

  async onMessage(data: OrderCancelledEvent["data"], message: JsMsg) {
    const { id, version } = data;

    const order = await Order.findOne({
      _id: id,
      version: version - 1,
    });

    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    message.ack();
  }
}

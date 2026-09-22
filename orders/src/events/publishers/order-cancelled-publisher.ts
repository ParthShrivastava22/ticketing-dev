import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@digitalassetps/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

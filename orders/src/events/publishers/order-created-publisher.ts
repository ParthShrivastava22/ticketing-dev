import { Publisher, Subjects, OrderCreatedEvent } from "@digitalassetps/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

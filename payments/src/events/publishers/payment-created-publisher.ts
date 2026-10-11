import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from "@digitalassetps/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

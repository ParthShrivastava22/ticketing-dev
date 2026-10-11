import { Stream } from "../base/base-stream";
import { Streams } from "../base/subjects";
import { Subjects } from "../base/subjects";

export class PaymentStream extends Stream {
  name: Streams.Payment = Streams.Payment;

  subjects: Subjects[] = [Subjects.PaymentCreated];
}

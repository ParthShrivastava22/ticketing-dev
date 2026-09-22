import { Stream, Streams, Subjects } from "@digitalassetps/common";

export class OrderStream extends Stream {
  name: Streams.Order = Streams.Order;

  subjects: Subjects[] = [Subjects.OrderCreated, Subjects.OrderCancelled];
}

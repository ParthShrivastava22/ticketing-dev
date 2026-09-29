import { Stream } from "../base/base-stream";
import { Streams } from "../base/subjects";
import { Subjects } from "../base/subjects";

export class OrderStream extends Stream {
  name: Streams.Order = Streams.Order;

  subjects: Subjects[] = [Subjects.OrderCreated, Subjects.OrderCancelled];
}

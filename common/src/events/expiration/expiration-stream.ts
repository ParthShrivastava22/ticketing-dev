import { Stream } from "../base/base-stream";
import { Streams } from "../base/subjects";
import { Subjects } from "../base/subjects";

export class ExpirationStream extends Stream {
  name: Streams.Expiration = Streams.Expiration;

  subjects: Subjects[] = [Subjects.ExpirationComplete];
}

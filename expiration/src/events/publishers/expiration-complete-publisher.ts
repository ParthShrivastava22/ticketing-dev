import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@digitalassetps/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

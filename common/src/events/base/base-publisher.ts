import { Codec, JetStreamClient } from "nats";
import { JSONCodec } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  private js: JetStreamClient;
  private jc: Codec<JSON>;

  constructor(js: JetStreamClient) {
    this.js = js;
    this.jc = JSONCodec();
  }

  async publish(data: T["data"]) {
    const ack = await this.js.publish(this.subject, this.jc.encode(data));

    console.log(`Event published successfully! Sequence ID: ${ack.seq}`);
  }
}

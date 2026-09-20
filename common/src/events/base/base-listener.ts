import type { JetStreamClient, JetStreamManager, Codec, JsMsg } from "nats";
import { JSONCodec, AckPolicy, DeliverPolicy } from "nats";
import { Subjects, Streams } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private jc: Codec<JSON>;

  abstract streamName: Streams;
  abstract subject: T["subject"];
  abstract consumerName: string;

  abstract onMessage(data: T["data"], message: JsMsg): Promise<void>;

  protected ackWait = 5 * 1000;

  constructor(js: JetStreamClient, jsm: JetStreamManager) {
    this.js = js;
    this.jsm = jsm;
    this.jc = JSONCodec();
  }

  subscriptionOptions() {
    return {
      name: this.consumerName,
      durable_name: this.consumerName,
      ack_policy: AckPolicy.Explicit,
      filter_subject: this.subject,
      deliver_policy: DeliverPolicy.All,
      ack_wait: this.ackWait,
    };
  }

  async addConsumer() {
    try {
      await this.jsm.consumers.add(this.streamName, this.subscriptionOptions());
    } catch (error) {
      // Consumer probably already exists.
    }
  }

  async listen() {
    await this.addConsumer();

    const consumer = await this.js.consumers.get(
      this.streamName,
      this.consumerName,
    );

    const messages = await consumer.consume();

    for await (const msg of messages) {
      const data = this.jc.decode(msg.data);

      console.log(`\nMessage received!`);
      console.log(`Subject: ${msg.subject}`);
      console.log(`Sequence: ${msg.seq}`);

      await this.onMessage(data, msg);

      msg.ack();
    }
  }
}

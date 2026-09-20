import { JetStreamManager } from "nats";
import { Streams, Subjects } from "./subjects";

export abstract class Stream {
  abstract name: Streams;
  abstract subjects: Subjects[];

  private jsm: JetStreamManager;

  constructor(jsm: JetStreamManager) {
    this.jsm = jsm;
  }

  async create() {
    try {
      await this.jsm.streams.add({
        name: this.name,
        subjects: this.subjects,
      });

      console.log(`Stream ${this.name} created`);
    } catch (error) {
      console.error(`Error creating stream ${this.name}:`, error);
    }
  }
}

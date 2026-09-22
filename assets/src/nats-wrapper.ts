import { connect } from "nats";
import type { NatsConnection, JetStreamManager, JetStreamClient } from "nats";
import { Stream } from "@digitalassetps/common";

type StreamConstructor = new (jsm: JetStreamManager) => Stream;

class NatsWrapper {
  private _connection?: NatsConnection;
  private _jsm?: JetStreamManager;
  private _js?: JetStreamClient;

  get client() {
    if (!this._connection) {
      throw new Error("Cannot access NATS Client before connecting");
    }
    this._js = this._connection.jetstream();
    return this._js;
  }

  async createStream(StreamClass: StreamConstructor) {
    if (!this._connection) {
      throw new Error("Cannot access NATS Client before connecting");
    }
    this._jsm ??= await this._connection.jetstreamManager();
    const newStream = new StreamClass(this._jsm);

    const existingStream = await this._jsm.streams
      .get(newStream.name)
      .catch(() => null);

    if (!existingStream) {
      await newStream.create();
      console.log(`Stream ${newStream.name} created`);
    }
  }

  async connect(servers: string) {
    this._connection = await connect({
      servers,
    });

    console.log("Successfully connected to NATS");
  }

  async close() {
    if (this._connection) {
      await this._connection.close();
      console.log("NATS connection closed");
    }
  }
}

export const natsWrapper = new NatsWrapper();

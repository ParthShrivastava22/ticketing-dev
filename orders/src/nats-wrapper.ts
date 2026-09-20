import { connect } from "nats";
import type { NatsConnection, JetStreamManager, JetStreamClient } from "nats";
import { Streams } from "@digitalassetps/common";

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

  async createStream() {
    if (!this._connection) {
      throw new Error("Cannot access NATS Client before connecting");
    }
    this._jsm = await this._connection.jetstreamManager();
    let stream = await this._jsm.streams.get(Streams.Asset).catch(() => null);

    if (!stream) {
    }

    console.log("Stream created");
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

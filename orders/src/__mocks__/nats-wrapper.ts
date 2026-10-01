import type { JetStreamClient, JetStreamManager } from "nats";

export const natsWrapper = {
  client: {
    publish: jest.fn().mockResolvedValue({
      stream: "ORDER",
      seq: 1,
    }),
  } as unknown as JetStreamClient,

  manager: jest.fn().mockResolvedValue({
    streams: {
      add: jest.fn(),
    },
  } as unknown as JetStreamManager),
};

import type { JetStreamClient } from "nats";

export const natsWrapper = {
  client: {
    publish: jest.fn().mockResolvedValue({
      stream: "ORDER",
      seq: 1,
    }),
  } as unknown as JetStreamClient,
};

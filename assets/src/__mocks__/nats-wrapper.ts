import type { JetStreamClient } from "nats";

export const natsWrapper = {
  client: {
    publish: jest.fn().mockResolvedValue({
      stream: "ASSET",
      seq: 1,
    }),
  } as unknown as JetStreamClient,
};

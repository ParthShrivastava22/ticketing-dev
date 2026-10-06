import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order.expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  const publisher = new ExpirationCompletePublisher(natsWrapper.client);

  await publisher.publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

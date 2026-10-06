import { natsWrapper } from "./nats-wrapper.js";
import { OrderCreatedListener } from "./events/listeners/order-created-listener.js";
import { OrderStream, ExpirationStream } from "@digitalassetps/common";

const start = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  let connected = false;

  // Keep trying until NATS is available
  while (!connected) {
    try {
      await natsWrapper.connect(process.env.NATS_URL);
      await natsWrapper.createStream(OrderStream);
      await natsWrapper.createStream(ExpirationStream);

      connected = true;
    } catch (err) {
      console.log("NATS not ready yet. Retrying in 5 seconds...");
      console.log(err);

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  const orderCreatedListener = new OrderCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  // Long-running listener
  orderCreatedListener.listen();

  const shutdown = async () => {
    await natsWrapper.close();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();

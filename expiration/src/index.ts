import { natsWrapper } from "./nats-wrapper.js";

const start = async () => {
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  let connected = false;

  // Keep trying until MongoDB finishes booting
  while (!connected) {
    try {
      await natsWrapper.connect(process.env.NATS_URL);
    } catch (err) {
      console.log("NATS or MongoDB not ready yet. Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  const shutdown = async () => {
    await natsWrapper.close();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();

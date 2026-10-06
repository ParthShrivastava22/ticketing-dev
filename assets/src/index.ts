import mongoose from "mongoose";
import { app } from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import { AssetStream, OrderStream } from "@digitalassetps/common";
import { OrderCreatedListener } from "./events/listeners/order-created-listener.js";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener.js";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  let connected = false;

  // Keep trying until NATS and MongoDB are available
  while (!connected) {
    try {
      await natsWrapper.connect(process.env.NATS_URL);

      await natsWrapper.createStream(AssetStream);
      await natsWrapper.createStream(OrderStream);

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });

      console.log("Connected to DB");
      connected = true;
    } catch (err) {
      console.log("NATS or MongoDB not ready yet. Retrying in 5 seconds...");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Create listeners after infrastructure is ready
  const orderCreatedListener = new OrderCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const orderCancelledListener = new OrderCancelledListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  // Start listeners.
  // These are long-running processes, so don't await them here.
  orderCreatedListener.listen();
  orderCancelledListener.listen();

  // Start HTTP server
  const server = app.listen(3000, () => {
    console.log("Listening on port 3000!!!! And secure is true");
  });

  const shutdown = async () => {
    console.log("Shutting down...");

    await natsWrapper.close();
    await mongoose.connection.close();

    server.close(() => {
      console.log("Application shut down");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();

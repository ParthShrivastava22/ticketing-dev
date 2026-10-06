import mongoose from "mongoose";
import { app } from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import { OrderStream, AssetStream } from "@digitalassetps/common";
import { AssetCreatedListener } from "./events/listeners/asset-created-listener.js";
import { AssetUpdatedListener } from "./events/listeners/asset-updated-listener.js";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  // Retry infrastructure only
  let connected = false;

  while (!connected) {
    try {
      await natsWrapper.connect(process.env.NATS_URL);
      await natsWrapper.createStream(OrderStream);
      await natsWrapper.createStream(AssetStream);

      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });

      connected = true;
    } catch (err) {
      console.error("STARTUP ERROR:", err);

      console.log("Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log("Connected to DB");

  // Create listeners ONCE
  const assetCreatedListener = new AssetCreatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  const assetUpdatedListener = new AssetUpdatedListener(
    natsWrapper.client,
    await natsWrapper.manager(),
  );

  // Start them concurrently
  assetCreatedListener.listen();
  assetUpdatedListener.listen();

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000");
  });

  const shutdown = async () => {
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

import mongoose from "mongoose";
import { app } from "./app.js";
import { natsWrapper } from "./nats-wrapper.js";
import { OrderStream } from "./events/streams/order-stream.js";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");

  let connected = false;

  // Keep trying until MongoDB finishes booting
  while (!connected) {
    try {
      await natsWrapper.connect(process.env.NATS_URL);
      await natsWrapper.createStream(OrderStream);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });
      console.log("Connected to DB");
      connected = true; // Break the loop on success
    } catch (err) {
      console.log("NATS or MongoDB not ready yet. Retrying in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000!!!! And secure is true");
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

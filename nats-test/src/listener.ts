import { connect } from "nats";
import { AssetCreatedListener } from "./events/asset-created-listener";

const run = async () => {
  try {
    const nc = await connect({
      servers: "nats://localhost:4222",
    });

    console.log("Listener connected to NATS");

    const js = nc.jetstream();
    const jsm = await nc.jetstreamManager();

    const listener = new AssetCreatedListener(js, jsm);
    await listener.listen();

    const shutdown = async () => {
      console.log("Shutting down listener...");

      await nc.close();

      console.log("NATS connection closed");

      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Listener error:", error);
  }
};

run();

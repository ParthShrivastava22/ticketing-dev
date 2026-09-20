import { connect } from "nats";
import { AssetStream } from "./events/asset-stream";
import { AssetCreatedPublisher } from "./events/asset-created-publisher";

const run = async () => {
  try {
    const nc = await connect({
      servers: "nats://localhost:4222",
    });

    console.log("Publisher connected to NATS");

    const js = nc.jetstream();
    const jsm = await nc.jetstreamManager();

    const assetStream = new AssetStream(jsm);
    await assetStream.create();

    const publisher = new AssetCreatedPublisher(js);

    await publisher.publish({
      id: "234",
      title: "Pixel Art Pack",
      price: 30,
    });

    console.log("Done");

    await nc.close();
  } catch (error) {
    console.error("Publisher error:", error);
  }
};

run();

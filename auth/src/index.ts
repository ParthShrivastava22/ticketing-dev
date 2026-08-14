import mongoose from "mongoose";
import { app } from "./app.js";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  let connected = false;

  // Keep trying until MongoDB finishes booting
  while (!connected) {
    try {
      await mongoose.connect("mongodb://auth-mongo-serv:27017/auth", {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });
      console.log("Connected to DB");
      connected = true; // Break the loop on success
    } catch (err) {
      console.log("MongoDB not ready yet. Retrying in 5 seconds...");
      // Pause the loop for 5 seconds before trying again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!! And secure is true");
  });
};

start();

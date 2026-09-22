import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper");
let mongo: any;

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = "astagfirullah";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();

  if (!collections) return;

  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongo) {
    await mongo.stop();
  }
});

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: "parthshri11@gmail.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};

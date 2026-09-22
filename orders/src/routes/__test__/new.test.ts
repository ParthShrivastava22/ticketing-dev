import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Asset } from "../../models/asset";
import { Order, OrderStatus } from "../../models/order";

it("has a route handler listening to /api/assets for post request", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  return request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if the asset does not exist", async () => {
  const assetId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ assetId })
    .expect(404);
});

it("returns an error if the asset is already reserved", async () => {
  const asset = Asset.build({ title: "Black 2 Pixels", price: 30 });
  await asset.save();

  const order = Order.build({
    asset,
    status: OrderStatus.Created,
    userId: "vastegunahuiyan",
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ assetId: asset.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  let assets = await Asset.find({});
  let orders = await Order.find({});
  expect(assets.length).toEqual(0);
  expect(orders.length).toEqual(0);

  const asset = Asset.build({ title: "Black 2 Pixels", price: 30 });
  await asset.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ assetId: asset.id })
    .expect(201);

  assets = await Asset.find({});
  orders = await Order.find({});
  expect(assets.length).toEqual(1);
  expect(orders.length).toEqual(1);
});

it.todo("emits an order created event");

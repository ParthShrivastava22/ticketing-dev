import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 when purchasing order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns NotAuthorizedError when purchasing an order no belonging to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = signin(id);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: id,
    status: OrderStatus.Cancelled,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      orderId: order.id,
    })
    .expect(400);
});

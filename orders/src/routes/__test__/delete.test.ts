import request from "supertest";
import { app } from "../../app";
import { Asset } from "../../models/asset";
import { OrderStatus } from "@digitalassetps/common";
import { natsWrapper } from "../../nats-wrapper";

const createAsset = async (title: string, price: number) => {
  const asset = Asset.build({ title, price });
  await asset.save();
  return asset;
};

it("throws an error if the order does not belong to the user", async () => {
  const asset = await createAsset("Black 2 Pixels", 30);

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ assetId: asset.id })
    .expect(201);

  const user2 = signin();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});

it("marks an order as cancelled", async () => {
  const asset = await createAsset("Black 2 Pixels", 30);
  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ assetId: asset.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  const { body: updatedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(updatedOrder.id).toEqual(order.id);
  expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order.cancelled event", async () => {
  const asset = await createAsset("Black 2 Pixels", 30);

  const user = signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ assetId: asset.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

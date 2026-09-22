import request from "supertest";
import { app } from "../../app";
import { Asset } from "../../models/asset";

const createAsset = async (title: string, price: number) => {
  const asset = Asset.build({ title, price });
  await asset.save();
  return asset;
};

it("fetches the order", async () => {
  // Create an asset
  const asset = await createAsset("Black 2 Pixels", 30);

  const user = signin();

  // Make a request to build an order with the asset
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ assetId: asset.id })
    .expect(201);

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if user tries to fetch asset he doesn't own", async () => {
  // Create an asset
  const asset = await createAsset("Black 2 Pixels", 30);

  const user = signin();

  // Make a request to build an order with the asset
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ assetId: asset.id })
    .expect(201);

  const user2 = signin();

  // Make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});

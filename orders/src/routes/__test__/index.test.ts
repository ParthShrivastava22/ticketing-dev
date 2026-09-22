import request from "supertest";
import { app } from "../../app";
import { Asset } from "../../models/asset";

const createAsset = async (title: string, price: number) => {
  const asset = Asset.build({ title, price });
  await asset.save();
  return asset;
};

it("fetches orders for a particular user", async () => {
  // Create three tickets
  const asset1 = await createAsset("Black 2 Pixels", 30);
  const asset2 = await createAsset("Heartgold Pixels", 26);
  const asset3 = await createAsset("Platinum Pixels", 28);

  // Create two users
  const user1 = signin();
  const user2 = signin();

  // Create one order as user #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ assetId: asset1.id })
    .expect(201);

  // Create two orders as user #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ assetId: asset2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ assetId: asset3.id })
    .expect(201);

  // Make request to get orders for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  // Make sure we only get orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);

  expect(response.body[1].asset.id).toEqual(asset3.id);
  expect(response.body[0].asset.id).toEqual(asset2.id);
});

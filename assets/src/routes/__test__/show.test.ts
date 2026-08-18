import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a status of 404 if the asset is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/assets/${id}`).send().expect(404);
});

it("returns the asset if the asset exists", async () => {
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  const asset = await request(app)
    .get(`/api/assets/${response.body.id}`)
    .send()
    .expect(201);

  expect(asset.body.title).toEqual("Heartgold Pixels");
  expect(asset.body.price).toEqual(10);
});

import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a status of 404 if the asset is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/assets/${id}`)
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(404);
});

it("can only be accessed if user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/assets/${id}`)
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(401);
});

it("returns a status of 401 if the user does not own the asset", async () => {
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/assets/${response.body.id}`)
    .set("Cookie", signin())
    .send({
      title: "Black 2 Pixels",
      price: 10,
    })
    .expect(401);
});

it("returns a status of 422 if the user provides an invalid title or price", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", cookie)
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/assets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Black 2 Pixels",
    })
    .expect(422);

  await request(app)
    .put(`/api/assets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(422);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", cookie)
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/assets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Black 2 Pixels",
      price: 15,
    })
    .expect(201);

  const asset = await request(app)
    .get(`/api/assets/${response.body.id}`)
    .send();

  expect(asset.body.title).toEqual("Black 2 Pixels");
  expect(asset.body.price).toEqual(15);
});

it("publishes an event", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", cookie)
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/assets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Black 2 Pixels",
      price: 15,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

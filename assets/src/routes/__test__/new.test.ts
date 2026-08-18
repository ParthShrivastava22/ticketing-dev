import request from "supertest";
import { app } from "../../app";
import { Asset } from "../../models/asset";

it("has a route handler listening to /api/assets for post request", async () => {
  const response = await request(app).post("/api/assets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  return request(app).post("/api/assets").send({}).expect(401);
});

it("returns a status other 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      price: 10,
    })
    .expect(422);

  await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(422);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
    })
    .expect(422);

  await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
      price: -10,
    })
    .expect(422);
});

it("creates an asset with valid parameters", async () => {
  // Add a check to make sure an asset is saved to the database (later)
  let assets = await Asset.find({});
  expect(assets.length).toEqual(0);

  await request(app)
    .post("/api/assets")
    .set("Cookie", signin())
    .send({
      title: "Heartgold Pixels",
      price: 10,
    })
    .expect(201);

  assets = await Asset.find({});
  expect(assets.length).toEqual(1);
});

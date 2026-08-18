import request from "supertest";
import { app } from "../../app";

const createAsset = (title: string, price: number) => {
  return request(app).post("/api/assets").set("Cookie", signin()).send({
    title,
    price,
  });
};

it("can fetch a list of tickets", async () => {
  await createAsset("Heartgold Pixels", 10);
  await createAsset("Black 2 Pixels", 15);

  const response = await request(app).get("/api/assets").expect(200);

  expect(response.body.length).toEqual(2);
});

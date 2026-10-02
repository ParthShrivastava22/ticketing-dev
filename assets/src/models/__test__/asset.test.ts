import { Asset } from "../asset";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a asset
  const asset = Asset.build({
    title: "Heartgold Pixels",
    price: 10,
    userId: "123456",
  });

  // Save the instance of the asset
  await asset.save();

  // Fetch the asset twice
  const first = await Asset.findById(asset.id);
  const second = await Asset.findById(asset.id);

  // Name two seperate changes to the asset we fetched
  first!.set({ price: 15 });
  second!.set({ price: 20 });

  // Save the first fetched ticket
  await first!.save();

  // Save the second fetched ticket
  await expect(second!.save()).rejects.toThrow();
});

it("increments the version number on multiple saves", async () => {
  const asset = Asset.build({
    title: "Heartgold Pixels",
    price: 10,
    userId: "123456",
  });

  await asset.save();
  expect(asset.version).toEqual(0);
  asset.set({ price: 15 });
  await asset.save();
  expect(asset.version).toEqual(1);
});

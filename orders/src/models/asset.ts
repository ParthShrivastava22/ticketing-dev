import mongoose from "mongoose";

// An interface that describes properties required to create a new asset
interface AssetAttrs {
  title: string;
  price: number;
}

// An interface that describes properties that the Asset Document has
interface AssetDoc extends mongoose.Document {
  title: string;
  price: number;
  id: string;
}

// An interface that describes properties that a Asset Model has
interface AssetModel extends mongoose.Model<AssetDoc> {
  build(attrs: AssetAttrs): AssetDoc;
}

const assetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const assetRet = ret as {
          _id?: unknown;
          __v?: number;
          id?: unknown;
        };

        assetRet.id = assetRet._id;
        delete assetRet._id;
        delete assetRet.__v;
      },
    },
  },
);

assetSchema.statics.build = (attrs: AssetAttrs) => {
  return new Asset(attrs);
};

const Asset = mongoose.model<AssetDoc, AssetModel>("Asset", assetSchema);

export { Asset };
export type { AssetDoc };

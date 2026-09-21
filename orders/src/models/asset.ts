import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

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
  isReserved(): Promise<boolean>;
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

assetSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    asset: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Asset = mongoose.model<AssetDoc, AssetModel>("Asset", assetSchema);

export { Asset };
export type { AssetDoc };

import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  paymentIntentId: string;
}

interface PaymentDoc extends mongoose.Document {
  id: string;
  orderId: string;
  paymentIntentId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const orderRet = ret as {
          _id?: unknown;
          id?: unknown;
        };

        orderRet.id = orderRet._id;
        delete orderRet._id;
      },
    },
    optimisticConcurrency: true,
    versionKey: "version",
  },
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema,
);

export { Payment };

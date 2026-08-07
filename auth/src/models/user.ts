import mongoose, { type ObjectId } from "mongoose";
import { Password } from "../services/password.js";

// An interface that describes properties required to create a new user
interface UserAttributes {
  email: string;
  password: string;
}

// An interface that describes properties that the User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

// An interface that describes properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const userRet = ret as {
          _id?: unknown;
          __v?: number;
          password?: string;
          id?: unknown;
        };

        userRet.id = userRet._id;

        delete userRet._id;
        delete userRet.__v;
        delete userRet.password;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

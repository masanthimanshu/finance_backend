import { Types, Schema, model } from "mongoose";

const investmentSchema = new Schema({ type: String, amount: Number });

const schema = new Schema({
  user: {
    ref: "user",
    type: Types.ObjectId,
    required: [true, "User Id is required"],
  },

  investment: investmentSchema,

  income: { type: Number, required: [true, "Income is required"] },
  balance: { type: Number, required: [true, "Balance is required"] },
});

export const profileModel = model("profile", schema);

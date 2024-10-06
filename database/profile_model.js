import { Types, Schema, model } from "mongoose";

const schema = new Schema({
  user: {
    ref: "user",
    unique: true,
    type: Types.ObjectId,
    required: [true, "User Id is required"],
  },

  income: { type: Number, required: [true, "Income is required"] },
  expense: { type: Number, required: [true, "Expense is required"] },
  savings: { type: Number, required: [true, "Savings is required"] },
  investment: { type: Number, required: [true, "Investment is required"] },
});

export const profileModel = model("profile", schema);

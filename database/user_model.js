import { Schema, model } from "mongoose";

const spendingSchema = new Schema({
  expense: Number,
  savings: Number,
  investment: Number,
});

const schema = new Schema({
  spending: spendingSchema,
  name: { type: String, default: "User" },
  income: { type: Number, default: 25000 },
  isVerified: { type: Boolean, default: false },
  code: { type: String, required: [true, "Country code is required"] },
  phone: { type: Number, unique: true, required: [true, "Phone is required"] },
});

export const userModel = model("user", schema);

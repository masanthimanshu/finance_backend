import { Schema, model } from "mongoose";

const schema = new Schema({
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  code: { type: String, required: [true, "Country code is required"] },
  phone: { type: Number, unique: true, required: [true, "Phone is required"] },
});

export const userModel = model("user", schema);

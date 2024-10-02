import { Types, Schema, model } from "mongoose";

const schema = new Schema({
  value: { type: Number, required: [true, "OTP is required"] },

  user: {
    ref: "user",
    type: Types.ObjectId,
    required: [true, "User Id is required"],
  },
});

export const otpModel = model("otp", schema);

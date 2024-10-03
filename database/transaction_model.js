import { Types, Schema, model } from "mongoose";

const schema = new Schema(
  {
    user: {
      ref: "user",
      type: Types.ObjectId,
      required: [true, "User Id is required"],
    },

    input: { type: String, required: [true, "Input is required"] },
    amount: { type: Number, required: [true, "Amount is required"] },
    category: { type: String, required: [true, "Category is required"] },
    subCategory: { type: String, required: [true, "SubCategory is required"] },
  },
  { timestamps: true }
);

export const transactionModel = model("transaction", schema);

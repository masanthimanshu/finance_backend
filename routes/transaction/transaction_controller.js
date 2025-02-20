import { Types } from "mongoose";
import { workerAi } from "../../cloudflare/worker_ai.js";
import { transactionModel } from "../../database/transaction_model.js";

export class TransactionController {
  addTransaction = async (res = Response, user, data) => {
    try {
      const output = await workerAi(data);
      const arr = output.split("->");

      await new transactionModel({
        user,
        input: data,
        category: arr[0].trim(),
        amount: parseInt(arr[2]),
        subCategory: arr[1].trim(),
      }).save();

      res.send({ message: "Data Added Successfully" });
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };

  totalAmount = async (res = Response, user) => {
    try {
      const result = await transactionModel.aggregate([
        { $match: { user: new Types.ObjectId(user, "hex") } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
      ]);

      res.send({ totalAmount: result });
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };
}

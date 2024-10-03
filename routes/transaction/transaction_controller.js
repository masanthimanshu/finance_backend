import { transactionModel } from "../../database/transaction_model.js";

export class TransactionController {
  addTransaction = async (res = Response, user, data) => {
    try {
      await new transactionModel({ user, ...data }).save();
      res.send({ message: "Data Added Successfully" });
    } catch (err) {
      res.status(502).send({ error: err.message });
    }
  };
}

import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { TransactionController } from "./transaction_controller.js";
import { transactionModel } from "../../database/transaction_model.js";

const token = new Tokens();
export const routes = Router();
const controller = new TransactionController();

routes.post("/add-transaction", (req, res) => {
  const schema = z.object({ input: z.string() }).strict();

  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  try {
    const { input } = schema.parse(req.body);
    controller.addTransaction(res, data, input);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

routes.get("/read-transaction", async (req, res) => {
  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  const chatData = await transactionModel
    .find({ user: data })
    .sort({ updatedAt: -1 });

  res.send({ chatData: chatData });
});

routes.get("/total-amount", async (req, res) => {
  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  controller.totalAmount(res, data);
});

routes.post("/delete", async (req, res) => {
  const schema = z.object({ chatId: z.string() }).strict();

  try {
    const { chatId } = schema.parse(req.query);
    await transactionModel.findByIdAndDelete(chatId);
    res.send({ message: "Data deleted successfully" });
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

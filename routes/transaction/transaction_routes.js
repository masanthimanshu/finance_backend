import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { TransactionController } from "./transaction_controller.js";

const token = new Tokens();
export const routes = Router();
const controller = new TransactionController();

routes.post("/add-transaction", (req, res) => {
  const schema = z.object({ input: z.string() }).strict();

  const { authorization } = req.headers;
  const user = token.decodeAuth(authorization);

  try {
    const data = schema.parse(req.body);
    controller.addTransaction(res, user.data, data.input);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

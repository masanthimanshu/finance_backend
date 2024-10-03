import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { TransactionController } from "./transaction_controller.js";

const token = new Tokens();
export const routes = Router();
const controller = new TransactionController();

routes.post("/add-transaction", (req, res) => {
  const schema = z.object({
    amount: z.number(),
    message: z.string(),
    category: z.string(),
    subCategory: z.string(),
  });

  const { authorization } = req.headers;
  const user = token.decodeAuth(authorization);

  try {
    schema.strict().parse(req.body);
    controller.addTransaction(res, user, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

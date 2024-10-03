import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { SpendingController } from "./spending_controller.js";

const token = new Tokens();
export const routes = Router();
const controller = new SpendingController();

routes.post("/add-spending", (req, res) => {
  const schema = z.object({
    expense: z.number(),
    savings: z.number(),
    investment: z.number(),
  });

  const { authorization } = req.headers;
  const user = token.decodeAuth(authorization);

  try {
    schema.strict().parse(req.body);
    controller.addSpending(res, user.data, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { ProfileController } from "./profile_controller.js";

const token = new Tokens();
export const routes = Router();
const controller = new ProfileController();

routes.post("/add-profile", (req, res) => {
  const schema = z.object({
    income: z.number(),
    expense: z.number(),
    savings: z.number(),
    investment: z.number(),
  });

  const { authorization } = req.headers;
  const user = token.decodeAuth(authorization);

  try {
    schema.strict().parse(req.body);
    controller.addProfile(res, user.data, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

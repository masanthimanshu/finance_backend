import { z } from "zod";
import { Router } from "express";
import { ProfileController } from "./profile_controller.js";

export const routes = Router();
const controller = new ProfileController();

routes.post("/update-profile", (req, res) => {
  const schema = z.object({
    user: z.string(),
    name: z.string(),
    income: z.number(),
    balance: z.number(),
    investment: z.array(),
  });

  try {
    schema.parse(req.body);
    controller.admin(res, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

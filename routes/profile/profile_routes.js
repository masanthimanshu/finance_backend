import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { ProfileController } from "./profile_controller.js";
import { profileModel } from "../../database/profile_model.js";

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
  const { data } = token.decodeAuth(authorization);

  try {
    schema.strict().parse(req.body);
    controller.addProfile(res, data, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

routes.get("/get-profile", async (req, res) => {
  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  const profileData = await profileModel.find({ user: data });
  res.json(profileData[0]);
});

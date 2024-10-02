import { z } from "zod";
import { Router } from "express";
import { AuthController } from "./auth_controller.js";

export const routes = Router();
const controller = new AuthController();

routes.post("/admin", (req, res) => {
  const schema = z.object({ user: z.string(), pass: z.string() }).strict();

  try {
    schema.parse(req.body);
    controller.admin(res, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

routes.post("/phone", (req, res) => {
  const schema = z.object({ code: z.string(), phone: z.number() }).strict();

  try {
    schema.parse(req.body);
    controller.phone(res, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

routes.post("/verify-phone", (req, res) => {
  const schema = z.object({ otp: z.number(), verId: z.string() }).strict();

  try {
    schema.parse(req.body);
    controller.verifyPhone(res, req.body);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

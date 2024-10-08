import { z } from "zod";
import { Router } from "express";
import { Tokens } from "../../utils/tokens.js";
import { ChatController } from "./chat_controller.js";
import { chatModel } from "../../database/chat_model.js";

const token = new Tokens();
export const routes = Router();
const controller = new ChatController();

routes.post("/add-chat", (req, res) => {
  const schema = z.object({ input: z.string() }).strict();

  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  try {
    const { input } = schema.parse(req.body);
    controller.addChat(res, data, input);
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

routes.get("/get-chat", async (req, res) => {
  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  const chatData = await chatModel.find({ user: data }).sort({ updatedAt: -1 });

  res.send({ chatData: chatData });
});

routes.get("/total-amount", async (req, res) => {
  const { authorization } = req.headers;
  const { data } = token.decodeAuth(authorization);

  controller.totalAmount(res, data);
});

routes.delete("/delete-chat", async (req, res) => {
  const schema = z.object({ chatId: z.string() }).strict();

  try {
    const { chatId } = schema.parse(req.query);
    await chatModel.findByIdAndDelete(chatId);
    res.send({ message: "Data deleted successfully" });
  } catch {
    return res.status(400).send({ error: "Missing required fields" });
  }
});

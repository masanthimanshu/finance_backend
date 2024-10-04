import { WebSocketServer } from "ws";
import { Tokens } from "../../utils/tokens.js";
import { chatModel } from "../../database/chat_model.js";

const token = new Tokens();

export const chatStream = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (socket, req) => {
    const { authorization } = req.headers;

    const uid = token.decodeAuth(authorization);

    const chatData = await chatModel.find({ user: uid.data });

    socket.send({ chats: chatData });
    socket.on("close", () => console.log("Client Disconnected"));
  });

  return wss;
};

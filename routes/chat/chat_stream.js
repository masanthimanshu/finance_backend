import { WebSocketServer } from "ws";

export const chatStream = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client Connected");
    ws.send({ message: "Message sent from NodeJS stream" });
    ws.on("close", () => console.log("Client Disconnected"));
  });

  return wss;
};

import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.send({ message: "It's Working" }));

app.listen(process.env.PORT, () => console.log("App Started"));

import "dotenv/config";

import cors from "cors";
import express from "express";
import { connect } from "mongoose";
import * as route from "./routes/export.js";
import { Middleware } from "./utils/middleware.js";

const mongoUri = `${process.env.DB_URL}?authSource=admin`;

const app = express();
const middleware = new Middleware();

app.use(cors());
app.use(express.json());

app.use("/secure", middleware.jwt);
app.use("/account", middleware.account);

app.get("/health", (req, res) => res.send({ message: "It's Working" }));
app.get("/secure/verify", (req, res) => res.send({ message: "User is valid" }));

app.use("/jwt", route.jwtRoutes);

app.use("/account/auth", route.authRoutes);

app.use("/secure/spending", route.spendingRoutes);
app.use("/secure/transaction", route.transactions);

app.listen(process.env.PORT, () => console.log("App Started"));

connect(mongoUri).then(() => console.log("Database Connected"));

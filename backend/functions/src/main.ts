import express from "express";
import cors from "cors";
import {authRoutes} from "./infraestructure/routes/auth/auth.routes";
import {taskRoutes} from "./infraestructure/routes/task/task.routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).send("API funcionando correctamente");
});

export const api = app;

import express from "express";
import cors from "cors";
import { authRoutes } from "./infraestructure/routes/auth/auth.routes";
import { taskRoutes } from "./infraestructure/routes/task/task.routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("*", express.json());
app.put("*", express.json());
app.patch("*", express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

export default app;

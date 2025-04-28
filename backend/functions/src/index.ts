import * as functions from "firebase-functions/v2";
import express from "express";
import cors from "cors";
import {authRoutes} from "./infraestructure/routes/auth/auth.routes";
import {taskRoutes} from "./infraestructure/routes/task/task.routes";

const app = express();

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API funcionando correctamente");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

export const api = functions.https.onRequest(
  {
    region: "us-central1",
    invoker: "public",
  },
  app
);

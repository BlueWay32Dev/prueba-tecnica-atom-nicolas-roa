import { Router } from "express";
import {
  loginHandler,
  refreshHandler,
  registerHandler,
} from "../../controllers/auth/auth.controller";

export const authRoutes = Router();
authRoutes.post("/login", loginHandler);
authRoutes.post("/register", registerHandler);
authRoutes.post("/refresh", refreshHandler);

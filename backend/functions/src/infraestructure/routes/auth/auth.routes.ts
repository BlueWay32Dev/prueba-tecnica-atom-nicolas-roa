import {Router} from "express";
import {
  loginHandler,
  refreshHandler,
  registerHandler,
} from "../../controllers/auth/auth.controller";

// eslint-disable-next-line new-cap
export const authRoutes = Router();

authRoutes.post("/login", loginHandler);
authRoutes.post("/register", registerHandler);
authRoutes.post("/refresh", refreshHandler);

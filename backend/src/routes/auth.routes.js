import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
const authRouter = Router();

authRouter.post("/sign-up", createUser);

authRouter.post("/sign-in", loginUser);

authRouter.post("/sign-out", isAuthenticated, logoutUser);

export default authRouter;

import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import { getChatToken } from "../controllers/chat.controllers.js";

const chatRouter = Router();

chatRouter.use("/token", isAuthenticated, getChatToken);

export default chatRouter;

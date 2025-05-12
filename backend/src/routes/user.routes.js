import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  getMyFriendUsers,
  getRecommendedUsers,
} from "../controllers/user.controllers.js";

const userRouter = Router();

// Middleware to check if the user is authenticated
userRouter.use(isAuthenticated);

userRouter.get("/", getRecommendedUsers);
userRouter.get("/friends", getMyFriendUsers);

export default userRouter;

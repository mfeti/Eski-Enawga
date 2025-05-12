import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriendUsers,
  getRecommendedUsers,
  getSentFriendRequests,
  sendFriendRequest,
} from "../controllers/user.controllers.js";

const userRouter = Router();

// Middleware to check if the user is authenticated
userRouter.use(isAuthenticated);

userRouter.get("/", getRecommendedUsers);
userRouter.get("/friends", getMyFriendUsers);
userRouter.post("/friend-request/:id", sendFriendRequest);
userRouter.put("/friend-request/:id/accept", acceptFriendRequest);

userRouter.get("/friend-requests", getFriendRequests);
userRouter.get("/outgoing-friend-requests", getSentFriendRequests);

export default userRouter;

import { Router } from "express";
import { createUser } from "../controllers/auth.controllers.js";
const authRouter = Router();

authRouter.post("/sign-up", createUser);

// authRouter.post("/sign-in", (req, res, next) => {
//   res.send("Login");
// });

// authRouter.post("/sign-out", (req, res, next) => {
//   res.send("Logout");
// });

export default authRouter;

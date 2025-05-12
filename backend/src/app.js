import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandle.middlewares.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// body parser setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;

import express from "express";
import cors from "cors";

const app = express();

// body parser setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

export default app;

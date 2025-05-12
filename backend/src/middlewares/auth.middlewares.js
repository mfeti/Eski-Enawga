import jwt from "jsonwebtoken";
import userModel from "../models/auth.models.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token)
      return res.status(401).json({
        success: false,
        message: "please login to access this account",
      });

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userModel.findById(decoded.userId);
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Please login to access this account",
      });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Please login to access this account",
      error: error.message,
    });
  }
};

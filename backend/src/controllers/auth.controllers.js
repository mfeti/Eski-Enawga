import jwt from "jsonwebtoken";
import userModel from "../models/auth.models.js";
import { isValidEmail, isValidPassword } from "../utils/validators.js";

export const createUser = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      const error = new Error("All field required");
      error.statusCode = 401;
      throw error;
    }

    // check if email and password are valid
    const isCorrectEmail = isValidEmail(email);
    const isCorrectPassword = isValidPassword(password);
    if (!isCorrectEmail || !isCorrectPassword) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already a exist take another one");
      error.statusCode = 401;
      throw error;
    }

    const avatar = `https://avatar.iran.liara.run/username?username=${fullName}`;

    const newUser = await userModel.create({
      fullName,
      email,
      password,
      profilePicture: avatar,
    });

    // create token
    const token = await jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    // TODO: user register in stream
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    next(err);
  }
};

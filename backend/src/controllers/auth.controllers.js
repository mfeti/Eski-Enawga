import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    if (!isValidEmail(email)) {
      const error = new Error("enter a valid email");
      error.status = 400;
      throw error;
    }

    if (!isValidPassword(password)) {
      const error = new Error(
        "password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters"
      );
      error.status = 400;
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

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // const isMatched = await userModel.comparePassword(password);
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = await jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Successfully logout!" });
};

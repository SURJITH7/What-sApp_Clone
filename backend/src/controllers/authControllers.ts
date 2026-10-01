import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/Users";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req: Request,res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({userId: user._id,}, process.env.JWT_SECRET as string, {expiresIn: "7d",});
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
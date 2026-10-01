import { Request, Response } from "express";
import User from "../models/Users";

export const getUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search as string;

    const users = await User.find({
      name: { $regex: search || "", $options: "i" },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
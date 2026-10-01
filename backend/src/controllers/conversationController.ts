import { Request, Response } from "express";
import Conversation from "../models/Conversation";

export const createConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentUserId = (req as Request & { userId: string }).userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      res.status(400).json({
        message: "Receiver ID is required",
      });
      return;
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [currentUserId, receiverId],
      },
    });

    if (existingConversation) {
      res.status(200).json(existingConversation);
      return;
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [currentUserId, receiverId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
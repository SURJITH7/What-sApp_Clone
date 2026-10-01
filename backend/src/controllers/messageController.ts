import { Request, Response } from "express";
import Message from "../models/Message";
import Conversation from "../models/Conversation";

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const senderId = (req as Request & { userId: string }).userId;

    const { conversationId, receiverId, message } = req.body;

    if (!conversationId || !receiverId || !message) {
      res.status(400).json({
        message: "Conversation ID, receiver ID and message are required",
      });
      return;
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({
        message: "Conversation not found",
      });
      return;
    }

    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      message,
      messageType: "text",
      status: "sent",
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
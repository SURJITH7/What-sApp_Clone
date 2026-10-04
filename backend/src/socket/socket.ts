import { Server } from "socket.io";
import http from "http";

import Message from "../models/Message";
import Conversation from "../models/Conversation";

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (conversationId: string) => {
      socket.join(conversationId);

      console.log(
        `Socket ${socket.id} joined conversation: ${conversationId}`
      );
    });

    socket.on("sendMessage", async (data) => {
      try {
        console.log("Message received:", data);

        const {
          conversationId,
          senderId,
          receiverId,
          message,
        } = data;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          console.log("Conversation not found");
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

        // Update last message
        conversation.lastMessage = newMessage._id;
        await conversation.save();

        console.log("Message saved:", newMessage._id);

        // Send message to other users in the room
        io.to(conversationId).emit("receiveMessage", newMessage);

      } catch (error) {
        console.error("Socket message error:", error);
      }
    });

    socket.on("messageDelivered", async (messageId: string) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      console.log("Message not found");
      return;
    }

    message.status = "delivered";

    await message.save();

    console.log("Message marked as delivered:", messageId);

    io.to(message.conversation.toString()).emit(
      "messageStatusUpdated",
      {
        messageId: message._id,
        status: message.status,
      }
    );
  } catch (error) {
    console.error("Message delivery error:", error);
  }
});

    socket.on("messageRead", async (messageId: string) => {
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      console.log("Message not found");
      return;
    }

    message.status = "read";

    await message.save();

    console.log("Message marked as read:", messageId);

    io.to(message.conversation.toString()).emit(
      "messageStatusUpdated",
      {
        messageId: message._id,
        status: message.status,
      }
    );
  } catch (error) {
    console.error("Message read error:", error);
  }
});

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
import { useEffect, useState } from "react";
import { getMessages } from "../services/messageService";
import MessageInput from "./MessageInput";
import socket from "../services/socket";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  messageType: "text" | "image";
  status: "sent" | "delivered" | "read";
  createdAt: string;
}

interface ChatWindowProps {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;

  conversationId: string | null;
}

function ChatWindow({
  user,
  conversationId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
  console.log("Trying to connect Socket.IO...");

  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });

  return () => {
    socket.off("connect");
    socket.off("connect_error");
  };
}, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        return;
      }

      try {
        const data = await getMessages(conversationId);

        console.log("Messages:", data);

        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
  if (!conversationId) {
    return;
  }

  socket.emit("joinRoom", conversationId);

  console.log("Joined conversation room:", conversationId);
}, [conversationId]);

 useEffect(() => {
  const handleReceiveMessage = (message: Message) => {
    console.log("Received message:", message);

    setMessages((prevMessages) => [
      ...prevMessages,
      message,
    ]);

    // Tell the backend that the message was delivered
    socket.emit("messageDelivered", message._id);
    socket.emit("messageRead", message._id);
  };

  socket.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, []);



    const handleSendMessage = (message: string) => {
  if (!conversationId) {
    return;
  }

  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("User ID not found");
    return;
  }

  socket.emit("sendMessage", {
    conversationId,
    senderId: userId,
    receiverId: user._id,
    message,
  });
};

  if (!user) {
    return (
      <div>
        <h2>Select a chat</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <p>{user.email}</p>

      <div>
        {messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((message) => (
  <div key={message._id}>
    <p>{message.message}</p>

    <small>
  {message.status === "sent" && "✓"}
  {message.status === "delivered" && "✓✓"}
  {message.status === "read" && "✓✓"}
</small>
  </div>
))
        )}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
import { useEffect, useState } from "react";
import { getMessages } from "../services/messageService";
import MessageInput from "./MessageInput";
import socket from "../services/socket";

interface Message {
  _id: string;
  sender: {
  _id: string;
  name: string;
  profileImage?: string;
};
  receiver: {
  _id: string;
  name: string;
  profileImage?: string;
};
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
  <div className="h-screen flex flex-col">

    {/* Chat Header */}
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center">
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="ml-3">
        <h2 className="font-semibold text-gray-800">
          {user.name}
        </h2>

        <p className="text-xs text-gray-500">
          {user.email}
        </p>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6">

      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">
            No messages yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">

          {messages.map((message) => {
            const currentUserId = localStorage.getItem("userId");
            console.log("MESSAGE SENDER:", message.sender);
  console.log("CURRENT USER:", currentUserId);
            const isMyMessage =
  message.sender._id === currentUserId;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isMyMessage
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                    isMyMessage
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">
                    {message.message}
                  </p>

                  <div
                    className={`flex justify-end items-center gap-1 mt-1 text-xs ${
                      isMyMessage
                        ? "text-green-100"
                        : "text-gray-400"
                    }`}
                  >
                    <span>
                      {new Date(
                        message.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {isMyMessage && (
                      <span>
                        {message.status === "sent" && "✓"}

                        {message.status === "delivered" &&
                          "✓✓"}

                        {message.status === "read" &&
                          "✓✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>

    {/* Message Input */}
    <div className="bg-white border-t border-gray-200 p-4">
      <MessageInput onSend={handleSendMessage} />
    </div>

  </div>
);
}

export default ChatWindow;
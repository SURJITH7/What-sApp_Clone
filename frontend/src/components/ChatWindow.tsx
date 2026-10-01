import { useEffect, useState } from "react";
import { getMessages } from "../services/messageService";

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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
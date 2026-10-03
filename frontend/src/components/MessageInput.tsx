import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message);

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;

import { useEffect, useState } from "react";
import api from "../services/api";
import { createOrGetConversation } from "../services/conversationService";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface SidebarProps {
  onSelectUser: (user: User, conversationId: string) => void;
}

function Sidebar({ onSelectUser }: SidebarProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (user: User) => {
    try {
      const conversation = await createOrGetConversation(user._id);

      console.log("Conversation:", conversation);

      onSelectUser(user, conversation._id);
    } catch (error) {
      console.error("Failed to create/get conversation:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Chats</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserClick(user)}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
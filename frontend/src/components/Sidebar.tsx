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
  <div className="h-screen flex flex-col">
    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">
        Chats
      </h2>

      {/* Search */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>

    {/* Users */}
    <div className="flex-1 overflow-y-auto">
      {filteredUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => handleUserClick(user)}
          className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-100 transition"
        >
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">
              {user.name}
            </h3>

            <p className="text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
);
}

export default Sidebar;
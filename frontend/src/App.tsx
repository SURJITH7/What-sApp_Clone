// // import { useEffect } from "react";
// // import { io } from "socket.io-client";

// // const socket = io("http://localhost:7090", {
// //   transports: ["polling"],
// // });

// // function App() {
// //   useEffect(() => {
// //     socket.on("connect", () => {
// //       console.log("Connected to Socket.IO:", socket.id);
// //     });

// //     socket.on("connect_error", (error) => {
// //       console.error("❌ Socket connection error:", error.message);
// //     });

// //     socket.on("disconnect", () => {
// //       console.log("Disconnected from Socket.IO");
// //     });

// //     socket.connect();

// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, []);

// //   return (
// //     <div>
// //       <h1>WhatsApp Clone</h1>
// //       <p>Socket.IO connection test</p>
// //     </div>
// //   );
// // }

// // export default App;

// import { useEffect } from "react";
// import { io } from "socket.io-client";

// function App() {
//   useEffect(() => {
//     const socket = io("http://localhost:7090", {
//       transports: ["polling"],
//       autoConnect: false,
//     });

//     socket.on("connect", () => {
//       console.log("Connected to Socket.IO:", socket.id);

//       const conversationId = "6aba85c6b1088d873b21e03e";

//       socket.emit("joinRoom", conversationId);

//       console.log("Joined conversation:", conversationId);
//     });

//     socket.on("connect_error", (error) => {
//       console.error("Connection error:", error.message);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("Disconnected:", reason);
//     });

//     socket.connect();

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>WhatsApp Clone</h1>
//       <p>Socket.IO room test</p>
//     </div>
//   );
// }

// export default App;

// import { useEffect } from "react";
// import { io } from "socket.io-client";

// function App() {
//   useEffect(() => {
//     const socket = io("http://localhost:7090", {
//       transports: ["polling"],
//       autoConnect: false,
//     });

//     const conversationId = "6aba85c6b1088d873b21e03e";

//     socket.on("connect", () => {
//       console.log("Connected:", socket.id);

//       socket.emit("joinRoom", conversationId);

//       console.log("Joined room:", conversationId);

//       setTimeout(() => {
//         socket.emit("sendMessage", {
//           conversationId,
//           senderId: "6aba569031b1bc236e36ad5a",
//           receiverId: "6aba8458b1088d873b21e03d",
//           message: "Hello from real-time messaging 👋",
//         });

//         console.log("Message sent");
//       }, 2000);
//     });

//     socket.on("receiveMessage", (data) => {
//       console.log("Received message:", data);
//     });

//     socket.on("connect_error", (error) => {
//       console.error("Connection error:", error.message);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("Disconnected:", reason);
//     });

//     socket.connect();

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>WhatsApp Clone</h1>
//       <p>MongoDB + Socket.IO messaging test</p>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  const handleSelectUser = (
    user: User,
    conversationId: string
  ) => {
    setSelectedUser(user);
    setSelectedConversationId(conversationId);
  };

  return (

    <>
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-[350px] bg-white border-r border-gray-200">
        <Sidebar onSelectUser={handleSelectUser} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-50">
        <ChatWindow
          user={selectedUser}
          conversationId={selectedConversationId}
        />
      </div>
    </div>
    </>
     

    
  );
}

export default App;
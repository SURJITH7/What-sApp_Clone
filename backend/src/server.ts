import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import conversationRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import { initializeSocket } from "./socket/socket";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "WhatsApp Clone API is running",
  });
});

const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 7090;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
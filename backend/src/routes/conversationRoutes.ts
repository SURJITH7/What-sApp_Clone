import { Router } from "express";
import { createConversation } from "../controllers/conversationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createConversation);

export default router;
import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);

export default router;
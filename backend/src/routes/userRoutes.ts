// import { Router, Request, Response } from "express";
// import { protect } from "../middleware/authMiddleware";

// const router = Router();

// router.get("/profile", protect, (req: Request, res: Response) => {
//   const userId = (req as Request & { userId: string }).userId;
//   res.json({
//     message: "You accessed a protected route",
//     userId,
//   });
// });

// export default router;

import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getUsers);

export default router;
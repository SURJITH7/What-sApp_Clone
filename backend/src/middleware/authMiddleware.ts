// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface JwtPayload {
//   userId: string;
// }

// export const protect = (req: Request, res: Response, next: NextFunction): void => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       res.status(401).json({
//         message: "No authorization header",
//       });
//       return;
//     }
//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       res.status(401).json({
//         message: "No token provided",
//       });
//       return;
//     }
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET as string
//     ) as JwtPayload;
//     (req as Request & { userId: string }).userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       message: "Invalid or expired token",
//     });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
   userId: string;
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization header:", authHeader ? "FOUND" : "MISSING");

    if (!authHeader) {
      res.status(401).json({ message: "No authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("Token exists:", token ? "YES" : "NO");

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    console.log("JWT_SECRET exists:", process.env.JWT_SECRET ? "YES" : "NO");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    console.log("JWT verified successfully:", decoded);

    (req as Request & { userId: string }).userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
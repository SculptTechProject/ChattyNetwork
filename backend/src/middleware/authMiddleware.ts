import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const tokenRecord = await prisma.userToken.findUnique({ where: { token } });
    if (!tokenRecord) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    if (new Date() > tokenRecord.expiresAt) {
      await prisma.userToken.delete({ where: { token } });
      res.status(401).json({ error: "Token expired" });
      return;
    }

    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Unauthorized",
      details: (error as Error).message,
    });
  }
};

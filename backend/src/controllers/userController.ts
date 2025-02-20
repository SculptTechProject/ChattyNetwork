import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const fetchName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Something went wrong" });
    next(error);
  }
};

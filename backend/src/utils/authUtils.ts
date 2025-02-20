import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exist!" });
      return;
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { email, password: passwordHash, firstName, lastName },
    });
    res.status(201).json({ message: "User created", user: newUser });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const countUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userCount = await prisma.user.count();
    res.status(200).json({ totalUsers: userCount });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

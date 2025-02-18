import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../controllers/authController";

const prisma = new PrismaClient();

export const registerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
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
      data: { email, password: passwordHash },
    });
    res.status(201).json({ message: "User created", user: newUser });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const loginAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required!" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password!" });
      return;
    }

    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password!" });
      return;
    }

    const token = generateToken(user.id.toString());

    res
      .status(200)
      .json({ message: "Login successful!", token, userId: user.id });
    return;
  } catch (error) {
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

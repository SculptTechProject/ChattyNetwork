import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h";

const generateToken = (userId: number) => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  } as jwt.SignOptions);
  const decoded = jwt.decode(token) as any;
  const expiresAt = new Date(decoded.exp * 1000);
  return { token, expiresAt };
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const { token, expiresAt } = generateToken(user.id);

    await prisma.userToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET) as any;
    await prisma.userToken.deleteMany({
      where: { userId: decodedToken.userId },
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export const generateToken = (userId: string, role: string = "user") => {
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: "1h" });
};

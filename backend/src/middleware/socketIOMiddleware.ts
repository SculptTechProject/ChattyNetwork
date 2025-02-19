import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const socketIOMiddleware = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: token missing"));
    }
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey"
      ) as { userId: number };
      socket.data.userId = decoded.userId;
      console.log(socket.data.userId);
      next();
    } catch (error) {
      next(new Error("Authentication error: invalid token"));
    }
  });
};

export const fetchToken = async (user: { id: number }) => {
  return await prisma.userToken.findUnique({
    where: { id: user.id },
  });
};

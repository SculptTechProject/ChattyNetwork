import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/authMiddleware";

const prisma = new PrismaClient();

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

/* io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey") as { userId: number };
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication error: invalid token"));
  }
}); */

io.on("connection", (socket) => {
  console.log(`🟢 Użytkownik połączony: ${socket.id} (userId: ${socket.data.userId})`);

  socket.on("sendMessage", async (messageData) => {
    console.log("📩 Nowa wiadomość:", messageData);

    const senderId = socket.data.userId;
    const receiverId = messageData.receiverId;
    const content = messageData.text;

    if (!senderId || !receiverId || !content) {
      return socket.emit("errorMessage", "Brak wymaganych danych wiadomości");
    }

    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Błąd przy zapisie wiadomości:", error);
      socket.emit("errorMessage", "Nie udało się wysłać wiadomości");
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Użytkownik rozłączony: ${socket.id}`);
  });
});

app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/protected", authMiddleware, (req, res) => {
  res.json({ message: "This route is protected", userId: (req as any).userId });
});

app.get("/", (req, res) => {
  res.send("ChattyNetwork API is running!");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Socket.IO + Express server running on http://localhost:${PORT}`);
});

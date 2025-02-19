import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/authMiddleware";
import { socketIOMiddleware } from "./middleware/socketIOMiddleware";
import { ioConnection } from "./controllers/ioController";

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

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

const corsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

socketIOMiddleware(io);

ioConnection(io); // Connection by ioSocket

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

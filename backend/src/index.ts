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
import userRoutes from "./routes/userRoutes";
import { Request, Response, NextFunction } from "express";

dotenv.config();

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

const prisma = new PrismaClient();

const api_url = process.env.API_URL;

if (!api_url) {
  console.error("Brak api_url w index.ts!");
}

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`https://chatty-network.vercel.app/`],
    methods: ["GET", "POST"],
  },
});

app.use(((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://chatty-network.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}) as express.RequestHandler);


const corsOptions = {
  origin: [`https://chatty-network.vercel.app/`],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Access-Control-Allow-Origin",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

socketIOMiddleware(io);

ioConnection(io); // Connection by ioSocket

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", userRoutes);

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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("./middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error: token missing"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecretkey");
        socket.data.userId = decoded.userId;
        next();
    }
    catch (error) {
        next(new Error("Authentication error: invalid token"));
    }
});
io.on("connection", (socket) => {
    console.log(`🟢 Użytkownik połączony: ${socket.id} (userId: ${socket.data.userId})`);
    socket.on("sendMessage", (messageData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("📩 Nowa wiadomość:", messageData);
        const senderId = socket.data.userId;
        const receiverId = messageData.receiverId;
        const content = messageData.text;
        if (!senderId || !receiverId || !content) {
            return socket.emit("errorMessage", "Brak wymaganych danych wiadomości");
        }
        try {
            const newMessage = yield prisma.message.create({
                data: {
                    senderId,
                    receiverId,
                    content,
                },
            });
            io.emit("receiveMessage", newMessage);
        }
        catch (error) {
            console.error("Błąd przy zapisie wiadomości:", error);
            socket.emit("errorMessage", "Nie udało się wysłać wiadomości");
        }
    }));
    socket.on("disconnect", () => {
        console.log(`🔴 Użytkownik rozłączony: ${socket.id}`);
    });
});
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/message", authRoutes_1.default);
app.get("/api/v1/protected", authMiddleware_1.authMiddleware, (req, res) => {
    res.json({ message: "This route is protected", userId: req.userId });
});
app.get("/", (req, res) => {
    res.send("ChattyNetwork API is running!");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO + Express server running on http://localhost:${PORT}`);
});

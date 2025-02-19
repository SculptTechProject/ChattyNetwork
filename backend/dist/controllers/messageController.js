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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId, content } = req.body;
        if (!senderId || !receiverId || !content) {
            res.status(400).json({ error: "All fields are required!" });
            return;
        }
        const message = yield prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
        res.status(201).json(message);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
        next(error);
    }
});
exports.sendMessage = sendMessage;

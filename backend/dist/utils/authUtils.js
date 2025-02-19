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
exports.countUsers = exports.registerAuth = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
    }
    try {
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "User already exist!" });
            return;
        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
        const passwordHash = yield bcryptjs_1.default.hash(password, saltRounds);
        const newUser = yield prisma.user.create({
            data: { email, password: passwordHash },
        });
        res.status(201).json({ message: "User created", user: newUser });
        return;
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.registerAuth = registerAuth;
const countUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield prisma.user.count();
        res.status(200).json({ totalUsers: userCount });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.countUsers = countUsers;

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
exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h";
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
    });
    const decoded = jsonwebtoken_1.default.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);
    return { token, expiresAt };
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const valid = yield bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const { token, expiresAt } = generateToken(user.id);
        yield prisma.userToken.create({
            data: {
                token,
                expiresAt,
                userId: user.id,
            },
        });
        res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        yield prisma.userToken.deleteMany({ where: { token } });
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;

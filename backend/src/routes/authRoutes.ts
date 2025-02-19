import { Router } from "express";
import { registerAuth, countUsers } from "../utils/authUtils";
import { login, logout } from "../controllers/authController";

const router = Router();

router.post("/register", registerAuth);

router.post("/login", login);
router.post("/logout", logout);

router.get("/count", countUsers);

export default router;

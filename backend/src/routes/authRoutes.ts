import { Router } from "express";
import { registerAuth, loginAuth, countUsers } from "../utils/authUtils";

const router = Router();

router.post("/register", registerAuth);

router.post("/login", loginAuth);

router.get("/count", countUsers);

export default router;

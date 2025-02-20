import { Router } from "express";
import { fetchName } from "../controllers/userController";

const router = Router();

router.get("/:id", fetchName);

export default router;

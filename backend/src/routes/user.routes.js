import { Router } from "express";
import { getMasterList, addPassenger, removePassenger } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/masterlist", authMiddleware, getMasterList);
router.post("/masterlist", authMiddleware, addPassenger);
router.delete("/masterlist/:id", authMiddleware, removePassenger);

export default router;

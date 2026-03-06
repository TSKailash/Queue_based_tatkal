import { Router } from "express";
import { lockSeats, getSeatStatus } from "../controllers/seat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/lock/:trainId", authMiddleware, lockSeats);
router.get("/status/:trainId", authMiddleware, getSeatStatus);
export default router;
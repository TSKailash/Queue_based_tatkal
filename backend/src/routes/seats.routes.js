import { Router } from "express";
import { lockSeats, getSeatStatus } from "../controllers/seat.controller.js";

const router = Router();

router.post("/lock/:trainId", lockSeats);
router.get("/status/:trainId", getSeatStatus);
export default router;

import { Router } from "express";
import { confirmBooking } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/confirm/:trainId", authMiddleware, confirmBooking);

export default router;

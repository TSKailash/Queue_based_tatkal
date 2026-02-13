import { Router } from "express";
import { confirmBooking, myBookings } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/confirm/:trainId", authMiddleware, confirmBooking);
router.get("/my", authMiddleware, myBookings);

export default router;

import { Router } from "express";
import {
  joinQueue,
  getQueueStatus,
  optOut
} from "../controllers/queue.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/join/:trainId", authMiddleware, joinQueue);
router.get("/status/:trainId", authMiddleware, getQueueStatus);
router.post("/optout/:trainId", authMiddleware, optOut);

export default router;

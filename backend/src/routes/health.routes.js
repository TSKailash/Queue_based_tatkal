import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "Tatkal Backend",
    timestamp: Date.now(),
  });
});

export default router;

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import seatRoutes from "./routes/seats.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/queue", queueRoutes);
app.use("/seats", seatRoutes);
app.use("/booking", bookingRoutes);
app.use("/auth", authRoutes);

export default app;
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import seatRoutes from "./routes/seats.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/health", healthRoutes);
app.use("/queue", queueRoutes);
app.use("/seats", seatRoutes);
app.use("/booking", bookingRoutes);
app.use("/auth", authRoutes);

export default app;
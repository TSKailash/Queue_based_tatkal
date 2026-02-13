import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import "./config/redis.js";
import "./queues/trainQueue.js";
import "./workers/trainWorker.js";
import { connectMongo } from "./config/mongo.js";

await connectMongo();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

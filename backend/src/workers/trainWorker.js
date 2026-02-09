import { trainQueue } from "../queues/trainQueue.js";
import redis from "../config/redis.js";
import { redisKeys } from "../utils/redisKeys.js";

const TRAINS = ["trainA", "trainB", "trainC"];
const ACTIVE_TTL = 120;

trainQueue.process("PROMOTE_USERS", async () => {
  for (const trainId of TRAINS) {
    const activeKey = redisKeys.activeUser(trainId);
    const waitingKey = redisKeys.waitingQueue(trainId);
    const lockKey = `lock:train:${trainId}:activation`;

    // 🔒 Acquire activation lock (NX)
    const gotLock = await redis.set(lockKey, "1", "NX", "EX", 5);
    if (!gotLock) continue;

    try {
      // Is someone already active?
      const activeUser = await redis.get(activeKey);
      if (activeUser) continue;

      // Get next waiting user
      const nextUser = await redis.lpop(waitingKey);
      if (!nextUser) continue;

      // Promote safely
      await redis.set(activeKey, nextUser, "EX", ACTIVE_TTL);

      await redis.hset(redisKeys.userState(nextUser), {
        trainId,
        status: "ACTIVE",
        activatedAt: Date.now(),
      });

      console.log(
        `🚦 User ${nextUser} promoted to ACTIVE on ${trainId} (120s)`
      );
    } finally {
      // Lock auto-expires, no manual DEL needed
    }
  }
});

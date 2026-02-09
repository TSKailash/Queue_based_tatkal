import Queue from "bull";

export const trainQueue = new Queue("train-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// run every 1 second
trainQueue.add(
  "PROMOTE_USERS",
  {},
  {
    repeat: { every: 1000 },
    removeOnComplete: true,
    removeOnFail: true,
  }
);

import Queue from "bull";

const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

export const trainQueue = new Queue("train-queue", redisConfig);

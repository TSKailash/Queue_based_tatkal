export const redisKeys = {
  waitingQueue: (trainId) => `queue:train:${trainId}:waiting`,
  activeUser: (trainId) => `queue:train:${trainId}:active`,
  userState: (userId) => `user:${userId}:state`,
  userLock: (userId, trainId) => `user:${userId}:locked:${trainId}`,
};

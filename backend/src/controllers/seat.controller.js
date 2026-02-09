import redis from "../config/redis.js";
import { redisKeys } from "../utils/redisKeys.js";

const SEATS = ["S1", "S2", "S3", "S4", "S5"];

export async function getSeatStatus(req, res) {
  const { trainId } = req.params;

  const seatsStatus = {};

  for (const seat of SEATS) {
    const bookedKey = `booked:train:${trainId}:${seat}`;
    const lockKey = `seat:train:${trainId}:${seat}`;

    // 1️⃣ Check BOOKED first
    const bookedBy = await redis.get(bookedKey);
    if (bookedBy) {
      seatsStatus[seat] = {
        status: "BOOKED",
        bookedBy,
      };
      continue;
    }

    // 2️⃣ Check LOCKED
    const lockedBy = await redis.get(lockKey);
    if (lockedBy) {
      const ttl = await redis.ttl(lockKey);
      seatsStatus[seat] = {
        status: "LOCKED",
        lockedBy,
        expiresIn: ttl,
      };
      continue;
    }

    // 3️⃣ AVAILABLE
    seatsStatus[seat] = {
      status: "AVAILABLE",
    };
  }

  return res.json({
    trainId,
    seats: seatsStatus,
  });
}


export async function lockSeats(req, res) {
  const { trainId } = req.params;
  const { seats } = req.body;
  const userId = req.user.id

  for (const seat of seats) {
    if (!SEATS.includes(seat)) {
      return res.status(400).json({
        message: `Invalid seat ${seat}`
      });
    }
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "Seats required" });
  }

  const activeKey = redisKeys.activeUser(trainId);
  const activeUser = await redis.get(activeKey);

  if (activeUser !== userId) {
    return res.status(403).json({ message: "User not ACTIVE" });
  }

  const userLockKey = redisKeys.userLock(userId, trainId);

  const alreadyLocked = await redis.exists(userLockKey);
  if (alreadyLocked) {
    return res.status(409).json({
      message: "Seats already locked by this user",
    });
  }

  const ttl = await redis.ttl(activeKey);
  if (ttl <= 0) {
    return res.status(403).json({ message: "ACTIVE window expired" });
  }

  const lockedSeats = [];

  try {
    for (const seat of seats) {
      const seatKey = `seat:train:${trainId}:${seat}`;
      const bookedKey = `booked:train:${trainId}:${seat}`;

      // 🚨 NEW: prevent locking BOOKED seats
      const isBooked = await redis.exists(bookedKey);
      if (isBooked) {
        throw new Error(`Seat ${seat} already booked`);
      }

      const locked = await redis.set(
        seatKey,
        userId,
        "NX",
        "EX",
        ttl
      );

      if (!locked) {
        throw new Error(`Seat ${seat} already locked`);
      }

      lockedSeats.push(seatKey);
    }
    await redis.set(userLockKey, "1", "EX", ttl);
    


    return res.json({
      status: "LOCKED",
      seats,
      expiresIn: ttl,
    });
  } catch (err) {
    // rollback
    if (lockedSeats.length > 0) {
      await redis.del(...lockedSeats);
    }
    await redis.del(userLockKey);

    return res.status(409).json({
      status: "FAILED",
      message: err.message,
    });
  }
}

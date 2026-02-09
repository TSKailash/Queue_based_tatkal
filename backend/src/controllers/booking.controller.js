import redis from "../config/redis.js";
import { redisKeys } from "../utils/redisKeys.js";

export async function confirmBooking(req, res){
    const {trainId}=req.params
    const {seats}=req.body
    const userId=req.user.id

    if(!userId){
        return res.status(400).json({message: "User ID is required in headers"})
    }

    if(!Array.isArray(seats) || seats.length === 0){
        return res.status(400).json({message: "Seats must be a non-empty array"})
    }

    const activeKey=redisKeys.activeUser(trainId)
    const activeUser=await redis.get(activeKey)

    if(activeUser != userId){
        return res.status(403).json({message: "You do not have an active booking for this train"})
    }

    for(const seat of seats){
        const seatKey=`seat:train:${trainId}:${seat}`
        const bookedKey=`booked:train:${trainId}:${seat}`

        const booked=await redis.exists(bookedKey)
        if(booked){
            return res.status(409).json({
                message: `Seat ${seat} is already booked`
            })
        }

        const lockedBy=await redis.get(seatKey)
        if(!lockedBy){
            return res.status(409).json({
                message: `Seat ${seat} is not locked`
            })
        }

        if(lockedBy !== userId){
            return res.status(403).json({
                message: `Seat ${seat} is locked by another user`
            })
        }
    }

    //commit phase
    const pipeline=redis.pipeline()
    for(const seat of seats){
        const seatKey=`seat:train:${trainId}:${seat}`
        const bookedKey=`booked:train:${trainId}:${seat}`
        pipeline.del(seatKey)
        pipeline.set(bookedKey, userId)
    }
    const userLockKey = redisKeys.userLock(userId, trainId);
    pipeline.del(userLockKey);
    pipeline.del(activeKey);
    await pipeline.exec()

    return res.json({
        status:"BOOKED",
        seats
    })
}
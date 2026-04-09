import redis from "../config/redis.js";
import { redisKeys } from "../utils/redisKeys.js";

export async function joinQueue(req, res){
    const {trainId}=req.params
    const userId=req.user.id

    if(!userId){
        console.log("Unauthorized access attempt to join queue");
        return res.status(401).json({message: "Unauthorized user"})
    }

    const waitingKey=redisKeys.waitingQueue(trainId)
    const activeKey=redisKeys.activeUser(trainId)
    const userStateKey=redisKeys.userState(userId)

    const activeUser=await redis.get(activeKey)
    if(activeUser==userId){
        return res.json({status:"ACTIVE"})
    }

    const pos=await redis.lpos(waitingKey, userId)
    if(pos!=null){
        return res.json({
            status:"WAITING",
            position: pos+1
        })
    }

    await redis.rpush(waitingKey, userId)
    const position=await redis.llen(waitingKey)
    
    await redis.hset(userStateKey, {
        trainId,
        status:"WAITING",
        joinedAt: Date.now()
    })
    return res.json({
        status:"WAITING",
        position
    })
}

export async function getQueueStatus(req, res){
    const {trainId}=req.params
    const userId=req.user.id
    
    const waitingKey=redisKeys.waitingQueue(trainId)
    const activeKey=redisKeys.activeUser(trainId)

    const activeUser = await redis.get(activeKey);
    if (activeUser === userId) {
        return res.json({
        status: "ACTIVE",
        remainingTime: await redis.ttl(activeKey),
        });
    }

    const pos = await redis.lpos(waitingKey, userId);
    if (pos === null) {
        return res.json({ status: "NOT_IN_QUEUE" });
    }

    return res.json({
        status: "WAITING",
        position: pos + 1,
    });
}

export async function optOut(req, res) {
    const { trainId } = req.params;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized user" });
    }

    const activeKey = redisKeys.activeUser(trainId);
    const waitingKey = redisKeys.waitingQueue(trainId);
    const userStateKey = redisKeys.userState(userId);
    const userLockKey = redisKeys.userLock(userId, trainId);

    const activeUser = await redis.get(activeKey);

    if (activeUser == userId) {
        const SEATS = Array.from({ length: 20 }, (_, i) => `S${i + 1}`);
        const keysToDelete = [];
        
        for (const seat of SEATS) {
            const seatKey = `seat:train:${trainId}:${seat}`;
            const lockedBy = await redis.get(seatKey);
            if (lockedBy == userId) {
                keysToDelete.push(seatKey);
            }
        }
        
        const pipeline = redis.pipeline();
        if (keysToDelete.length > 0) {
            pipeline.del(...keysToDelete);
        }
        pipeline.del(activeKey);
        pipeline.del(userLockKey);
        pipeline.hset(userStateKey, "status", "OPTED_OUT");
        await pipeline.exec();

        return res.json({ message: "Opted out successfully. Seat locks released." });
    }

    const pos = await redis.lpos(waitingKey, userId);
    if (pos != null) {
        const pipeline = redis.pipeline();
        pipeline.lrem(waitingKey, 0, userId);
        pipeline.hset(userStateKey, "status", "OPTED_OUT");
        await pipeline.exec();
        
        return res.json({ message: "Opted out successfully from waiting queue." });
    }

    return res.status(400).json({ message: "User is neither active nor in the queue." });
}
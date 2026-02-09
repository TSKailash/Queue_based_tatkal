import redis from "../config/redis.js";
import { redisKeys } from "../utils/redisKeys.js";

export async function joinQueue(req, res){
    const {trainId}=req.params
    const userId=req.user.id

    if(!userId){
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
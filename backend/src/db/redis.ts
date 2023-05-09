import dotenv from "dotenv";
import { Redis } from "ioredis";

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on("connecting", () => {
  console.log("Initialized Redis connection");
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting");
});

redisClient.on("close", () => {
  console.log("Redis closed");
});

export default redisClient as Redis;

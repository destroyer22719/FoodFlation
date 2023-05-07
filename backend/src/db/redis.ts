import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.REDIS_URL);

const redisClient = new Redis(process.env.REDIS_URL as string, {
  
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

redisClient.on("close", () => {
  console.log("Redis closed");
});

export default redisClient;

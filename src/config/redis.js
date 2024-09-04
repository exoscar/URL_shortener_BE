import { createClient } from "redis";
import { config } from "dotenv";

config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

const connectRedis = async () => {
  await redisClient.connect();
};

connectRedis();

export { redisClient };

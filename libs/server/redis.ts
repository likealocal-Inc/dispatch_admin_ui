import Redis, { RedisOptions } from "ioredis";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export function createRedisInstance() {
  try {
    const options: RedisOptions = {
      host: publicRuntimeConfig.REDIS_IP,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    options.port = publicRuntimeConfig.REDIS_PORT;

    const redis = new Redis(options);

    redis.on("error", (error: unknown) => {
      console.warn("[Redis] Error connecting", error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}

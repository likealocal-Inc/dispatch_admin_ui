// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRedisInstance } from "@libs/server/redis";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const redis = createRedisInstance();
  redis.set("DDDD", "goodman");

  res.status(200).json({ name: "John Doe" });
}

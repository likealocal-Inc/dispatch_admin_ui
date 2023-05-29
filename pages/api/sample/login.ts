import type { NextApiRequest, NextApiResponse } from "next";

export interface LoginResponse {
  ok: boolean;
  res: Object;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  setTimeout(() => {
    res.status(200).json({ ok: true, res: "John Doe" });
  }, 2000);
}

import { APIURLs } from "@libs/client/constants";
import axios from "axios";

export default async function handler(req: any, res: any) {
  const url = APIURLs.HEALTH_CHECL;

  try {
    await axios.get(url.url);
    res.status(200).json({ message: "Server is healthy" });
  } catch (error: any) {
    if (error.isAxiosError && error.response) {
      res.status(500).json({ message: "Server is not responding properly" });
    } else {
      res.status(500).json({ message: "Unable to connect to the server" });
    }
  }
}

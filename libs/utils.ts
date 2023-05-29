import sleep from "sleep-promise";
import { APIURLs } from "./client/constants";
import { callAPI } from "./client/call/call";
import { DateUtils } from "./date.utils";

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export async function getRandomImage({
  size = 100,
  delay = 0,
}: {
  size?: number;
  delay?: number;
}): Promise<Response> {
  if (delay) {
    await sleep(delay);
  }
  return await fetch(`https://picsum.photos/${size}`);
}

export const jsonToString = (json: any): string => {
  const keys = Object.keys(json);
  let res = "";
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    const val = json[key];

    res += key + " : " + val + "</br></br>";
  }

  return res;
};

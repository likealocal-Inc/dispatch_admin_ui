import { callAPI } from "../call/call";
import { APIURLs } from "../constants";
import { getToken, removeToken } from "./token.utils";

/**
 * 토큰 확인 -> 로그인여부 체크
 * @returns
 */
export async function checkToken() {
  const res = await callAPI({ urlInfo: APIURLs.CHECK_TOKEN });
  return res.json().then((d) => d);
}

export async function logout() {
  removeToken();
}

import axios from "axios";
import { METHOD, APIURLType } from "../constants";
import { getToken } from "../utils/token.utils";
interface CallAPIProps {
  urlInfo: APIURLType;
  params?: any;
  addUrlParams?: string;
}

export async function callAPI({
  urlInfo,
  params = {},
  addUrlParams = "",
}: CallAPIProps): Promise<Response> {
  // 서버 건강체크
  try {
    await axios.get("/api/healthcheck");
  } catch (err) {
    location.href = "/error_network.html";
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${await getToken()}`,
  };

  if (urlInfo.method === METHOD.GET) {
    let query = Object.keys(params)
      //.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .map((k) => k + "=" + JSON.stringify(params[k]))
      .join("&");

    let url2 = urlInfo.url + addUrlParams + "?" + query;

    return fetch(url2, {
      method: urlInfo.method,

      headers: headers,
    });
  } else {
    return fetch(urlInfo.url + addUrlParams, {
      method: urlInfo.method,
      headers: headers,
      body: JSON.stringify(params),
    });
  }
}

/**
 * 직업 호출할 API정의
 */
export const callList = {};

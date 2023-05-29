import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const PROTOCAL = publicRuntimeConfig.HTTP_PROTOCAL;
const IP = publicRuntimeConfig.SERVER_IP;
const PORT = publicRuntimeConfig.SERVER_PORT;

const SERVER = `${PROTOCAL}://${IP}:${PORT}`;

// API URL 생성하기
const makeAPIURL = (path: string) => `${SERVER}/api/${path}`;

export enum METHOD {
  POST = "POST",
  GET = "GET",
  DELTE = "DELETE",
  PATCH = "PATCH",
}

/**
 * 페이지 URL
 */
export const PageURLs = {
  ROOT: "/",
  LOGIN: "/auth/login",
  JOIN: "/auth/join",
  MAIN: "/admin/dispatch",
};

export interface APIURLType {
  url: string;
  method: METHOD;
  desc: string;
}

/**
 * 실제 호출할 URL등록
 */
export const APIURLs = {
  JOIN: <APIURLType>{
    url: makeAPIURL("c.auth/join/email"),
    method: METHOD.POST,
    desc: "회원가입",
  },
  LOGIN: <APIURLType>{
    url: makeAPIURL("c.auth/login/email"),
    method: METHOD.POST,
    desc: "로그인",
  },
  LOGOUT: <APIURLType>{
    url: makeAPIURL("c.auth/logout"),
    method: METHOD.POST,
    desc: "로그아웃",
  },
  CHECK_TOKEN: <APIURLType>{
    url: makeAPIURL("c.auth/check/token"),
    method: METHOD.POST,
    desc: "토큰체크",
  },
  USER_LIST: <APIURLType>{
    url: makeAPIURL("c.user"),
    method: METHOD.GET,
    desc: "사용자리스트",
  },
  USER_UPDATE: <APIURLType>{
    url: makeAPIURL("c.user"),
    method: METHOD.PATCH,
    desc: "사용자수정",
  },
  USER_DELETE: <APIURLType>{
    url: makeAPIURL("c.user"),
    method: METHOD.DELTE,
    desc: "사용자삭제",
  },
  ME: <APIURLType>{
    url: makeAPIURL("c.user/me"),
    method: METHOD.POST,
    desc: "내프로필조회",
  },
  USER_BY_ID: <APIURLType>{
    url: makeAPIURL("c.user/user"),
    method: METHOD.GET,
    desc: "아이디로 사용자 조회",
  },
  COMPANY_UPDATE: <APIURLType>{
    url: makeAPIURL("company"),
    method: METHOD.PATCH,
    desc: "업체 수정",
  },
  COMPANY_LIST: <APIURLType>{
    url: makeAPIURL("company"),
    method: METHOD.GET,
    desc: "업체 조회",
  },
  COMPANY_CREATE: <APIURLType>{
    url: makeAPIURL("company"),
    method: METHOD.POST,
    desc: "업체 생성",
  },
  COMPANY_DELETE: <APIURLType>{
    url: makeAPIURL("company"),
    method: METHOD.DELTE,
    desc: "업체 제거",
  },
  ORDER_CREATE: <APIURLType>{
    url: makeAPIURL("order"),
    method: METHOD.POST,
    desc: "주문생성",
  },
  ORDER_UPDATE: <APIURLType>{
    url: makeAPIURL("order"),
    method: METHOD.PATCH,
    desc: "주문수정",
  },
  ORDER_LIST: <APIURLType>{
    url: makeAPIURL("order"),
    method: METHOD.GET,
    desc: "주문리스트 조회",
  },
  ORDER_MODIFY: <APIURLType>{
    url: makeAPIURL("order"),
    method: METHOD.PATCH,
    desc: "주문 데이터 수정",
  },
  ORDER_STATUS_UPDATE: <APIURLType>{
    url: makeAPIURL("order/status"),
    method: METHOD.PATCH,
    desc: "배차 상태값 변경",
  },
  DISPATCH_CREATE: <APIURLType>{
    url: makeAPIURL("dispatch"),
    method: METHOD.POST,
    desc: "배차 생성",
  },
  DISPATCH_UPDATE: <APIURLType>{
    url: makeAPIURL("dispatch"),
    method: METHOD.PATCH,
    desc: "배차 생성",
  },
  DISPATCH_GET: <APIURLType>{
    url: makeAPIURL("dispatch"),
    method: METHOD.GET,
    desc: "배차 생성",
  },
  DISPATCH_GET_BY_ORDERID: <APIURLType>{
    url: makeAPIURL("dispatch/order"),
    method: METHOD.GET,
    desc: "배차 생성",
  },
};

/**
 * 로그인이 필요 없는 페이지주소
 */
export const NoNeedAuthURLs = [PageURLs.LOGIN, PageURLs.JOIN];

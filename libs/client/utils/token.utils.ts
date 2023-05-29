import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

/**
 * 로컬스토리지 키
 */
export const LOCALSTORAGE = {
  _SESSION_KEY: publicRuntimeConfig.LOCALSTORAGE_KEY,
};

export async function setToken(token: string) {
  await localStorage.setItem(LOCALSTORAGE._SESSION_KEY, token);
}

export async function getToken() {
  return await localStorage.getItem(LOCALSTORAGE._SESSION_KEY);
}

export async function removeToken() {
  await localStorage.removeItem(LOCALSTORAGE._SESSION_KEY);
}

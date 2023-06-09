import axios from "axios";
import { callAPI } from "../call/call";
import { APIURLs, localstorageObj } from "../constants";
import { SecurityUtils } from "./security.utils";

export const ElseUtils = {
  // 로컬스토리지에서 사용자 꺼내기
  getUserFromLocalStorage: () => {
    const cacheUser = SecurityUtils.decrypt(
      localStorage.getItem(localstorageObj.key.userKey)!
    );
    if (cacheUser === undefined) return;
    return JSON.parse(cacheUser);
  },

  setUserInLocalStorage: async () => {
    await callAPI({ urlInfo: APIURLs.ME })
      .then((d) => d.json())
      .then((d) => {
        localStorage.setItem(
          localstorageObj.key.userKey,
          SecurityUtils.encrypt(JSON.stringify(d.data)).toString()
        );
        return d.data;
      });
  },
};

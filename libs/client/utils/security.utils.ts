import CryptoJS from "crypto-js";

export const SecurityUtils = {
  key: "sksms100djrdmfekf!@#$tjdgksek!@#$",
  encrypt: (data: string) => {
    return CryptoJS.AES.encrypt(data, SecurityUtils.key);
  },
  decrypt: (data: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(data, SecurityUtils.key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error(err);
      return;
    }
  },
};

import KakaoLogin from "react-kakao-login";
import { useState, useEffect } from "react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export default function Auth() {
  const [key, setKey] = useState("");
  useEffect(() => {
    setKey(publicRuntimeConfig.KAKAO_KEY);
  }, []);

  return (
    <>
      <KakaoLogin
        onFail={console.log}
        onSuccess={console.log}
        onLogout={console.log}
        token={key}
      />
    </>
  );
}

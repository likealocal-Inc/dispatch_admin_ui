import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

import "../styles/fonts.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // 인증여부 확인
  // 인증이 필요한 페이지 경우 인증이 안되어 있으면 로그인페이로이동
  // const socket = useSocket("http://127.0.0.1:9999");

  return (
    <SWRConfig
      value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

import { PageURLs } from "@libs/client/constants";
import { checkToken } from "@libs/client/utils/auth.utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();

  async function init() {
    const res = await checkToken();
    if (res.ok) {
      router.replace(PageURLs.MAIN);
    } else {
      router.replace(PageURLs.LOGIN);
    }
  }

  useEffect(() => {
    init();
    // router.replace("/auth/login");
  }, []);
}

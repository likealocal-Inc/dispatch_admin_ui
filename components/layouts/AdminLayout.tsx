import Head from "next/head";
import { useRouter } from "next/router";

import Sidebar from "@components/Sidebar";
import { PageURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { checkToken } from "@libs/client/utils/auth.utils";

import { useEffect, useState } from "react";
import { ElseUtils } from "@libs/client/utils/else.utils";

interface AdminProps {
  children?: any;
  menuTitle: string;
}
const AdminLayout = ({ menuTitle, children }: AdminProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserModel>();
  useEffect(() => {
    checkToken().then((d) => {
      if (d.ok === false) {
        router.push(PageURLs.LOGIN);
      }
    });
  });

  useEffect(() => {
    setLoading(true);
    ElseUtils.setUserInLocalStorage().then((d: any) => {
      setUser(d);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>{menuTitle}</title>
      </Head>
      <>
        <div className=''>
          {loading ? (
            ""
          ) : (
            <>
              <Sidebar />
              <div className='ml-44'>{children}</div>
            </>
          )}
        </div>
      </>
    </>
  );
};

export default AdminLayout;

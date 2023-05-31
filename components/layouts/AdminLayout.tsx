import Sidebar from "@components/Sidebar";
import { callAPI } from "@libs/client/call/call";
import { APIURLs, PageURLs, localstorageObj } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { checkToken } from "@libs/client/utils/auth.utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    callAPI({ urlInfo: APIURLs.ME })
      .then((d) => d.json())
      .then((d) => {
        setUser(d.data);
        localStorage.setItem(
          localstorageObj.key.userKey,
          JSON.stringify(d.data)
        );
      });
  }, []);

  return (
    <>
      <Head>
        <title>{menuTitle}</title>
      </Head>
      <>
        <div className=''>
          <Sidebar userModel={user} />
          {<div className='ml-44'>{children}</div>}
        </div>
      </>
    </>
  );
};

export default AdminLayout;

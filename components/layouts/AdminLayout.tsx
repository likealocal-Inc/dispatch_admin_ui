import Sidebar from "@components/Sidebar";
import { PageURLs } from "@libs/client/constants";
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
  useEffect(() => {
    checkToken().then((d) => {
      if (d.ok === false) {
        router.push(PageURLs.LOGIN);
      }
    });
  });

  return (
    <>
      <Head>
        <title>{menuTitle}</title>
      </Head>
      <>
        <div className=''>
          <Sidebar />
          {<div className='ml-44'>{children}</div>}
        </div>
      </>
    </>
  );
};

export default AdminLayout;

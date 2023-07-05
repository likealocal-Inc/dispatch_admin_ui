import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ButtonNoBorder from "./buttons/ButtonNoBorder";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLs, PageURLs, localstorageObj } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { ElseUtils } from "@libs/client/utils/else.utils";

interface MenuLiProps {
  label: string;
  url: string;
}

export default function Sidebar() {
  const router = useRouter();

  const [user, setUser] = useState<UserModel>();
  // 로그아웃 처리
  const [logout, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.LOGOUT,
  });

  useEffect(() => {
    setUser(ElseUtils.getUserFromLocalStorage());
  }, []);

  useEffect(() => {
    if (!loading) {
      if (data?.ok) {
        router.replace(PageURLs.ROOT);
      }
    }
  }, [loading, data]);

  const menuLi = ({ label, url }: MenuLiProps) => {
    return (
      <li className='items-center'>
        <Link href={url}>
          <div
            className={
              "text-sm py-3 block " +
              (router.pathname.indexOf(url) !== -1
                ? "text-yellow-500 hover:text-red-300 font-bold"
                : "text-white hover:text-blue-200")
            }
          >
            {label}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <>
      <nav className='fixed top-0 bottom-0 left-0 z-10 flex-row items-center justify-between block px-6 py-4 overflow-hidden overflow-y-auto shadow-xl bg-blueGray-800 w-44 flex-nowrap'>
        <div className='flex flex-col justify-between w-full min-h-full px-0 mx-auto flex-nowrap'>
          <div className='p-4 px-0 pb-2 mr-0 text-2xl font-bold text-center text-gray-400 whitespace-nowrap'>
            메뉴
            <br />
            <div className='text-xs'>
              [{user?.company}.{user?.role}]
              <br />
              {user?.email}
            </div>
          </div>
          <div className='relative top-0 left-0 right-0 flex flex-col flex-1 h-auto mt-4 overflow-x-hidden overflow-y-auto rounded shadow opacity-100 '>
            <hr className='min-w-full my-2' />
            <ul className='flex flex-col min-w-full list-none'>
              {/* {menuLi({ label: "대쉬보드", url: "/admin/dashboard" })} */}
              {menuLi({ label: "배차리스트", url: "/admin/dispatch" })}

              {user
                ? ["ADMIN", "SUPER"].includes(user?.role)
                  ? menuLi({ label: "배차엑셀다운", url: "/admin/excel" })
                  : ""
                : ""}

              {user?.role !== "USER" ? (
                <>
                  {menuLi({ label: "사용자리스트", url: "/admin/users" })}
                  {menuLi({ label: "업체리스트", url: "/admin/companies" })}
                </>
              ) : (
                ""
              )}
              {menuLi({ label: "프로필수정", url: "/admin/profile" })}
              <li>
                <div className='absolute bottom-2'>
                  <ButtonNoBorder
                    onClick={() => {
                      localStorage.removeItem(localstorageObj.key.userKey);
                      logout();
                    }}
                    label={"로그아웃"}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

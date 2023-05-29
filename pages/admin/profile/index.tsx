import ModalMessage from "@components/Modals/ModalMessage";
import AdminLayout from "@components/layouts/AdminLayout";
import { callAPI } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { UserModel } from "@libs/client/models/user.model";
import React, { useEffect, useState } from "react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState<UserModel>();
  const [message, setMessage] = useState("");

  // 모달 설정
  const [isOpen, setIsOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const [update, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.USER_UPDATE,
  });

  useEffect(() => {
    if (!loading) {
      if (data?.ok === false) {
        setMessage(data?.data.description.codeMessage);
      } else if (data?.ok === true) {
        setMessage("업데이트 완료");
      }
    }
  }, [loading]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;

  //   setProfile({ ...profile, [name]: value });
  // };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("진행중.....");
    setTimeout(() => {
      update(profile);
    }, 500);
  };

  useEffect(() => {
    callAPI({ urlInfo: APIURLs.ME }).then((d) => {
      const user = d.json().then((d) => {
        setProfile(d.data);
      });
    });
  }, []);

  return (
    <>
      <AdminLayout menuTitle='프로필 수정'>
        {profile === undefined ? (
          "Loading..."
        ) : (
          <div className='flex flex-col items-center h-screen pt-10 bg-gray-500'>
            <div className='p-4 text-2xl font-bold text-center text-white '>
              사용자 정보 수정
            </div>
            <form
              onSubmit={handleSubmit}
              className='px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md'
            >
              <div className='mb-4'>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='email'
                  >
                    Email
                  </label>
                  <input
                    className='w-full px-3 py-2 font-bold leading-tight text-white border rounded shadow appearance-none bg-gray-70 focus:outline-none focus:shadow-outline'
                    id='email'
                    name='email'
                    type='email'
                    disabled
                    value={profile ? profile.email : ""}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='password'
                  >
                    Password
                  </label>
                  <input
                    className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='password'
                    name='password'
                    type='password'
                    value={profile.password}
                    onChange={(v) => {
                      setProfile({ ...profile, password: v.target.value });
                    }}
                  />
                </div>
                <label
                  className='block mb-2 text-sm font-bold text-gray-700'
                  htmlFor='phone'
                >
                  Phone
                </label>
                <input
                  className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                  id='phone'
                  name='phone'
                  type='text'
                  value={profile ? profile.phone : ""}
                  onChange={(v) => {
                    setProfile({ ...profile, phone: v.target.value });
                  }}
                />
              </div>
              <div className='mb-4'>
                <label
                  className='block mb-2 text-sm font-bold text-gray-700'
                  htmlFor='company'
                >
                  Company
                </label>
                <input
                  className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                  id='company'
                  name='company'
                  type='text'
                  value={profile ? profile.company : ""}
                  onChange={(v) => {
                    setProfile({ ...profile, company: v.target.value });
                  }}
                />
              </div>

              <div className='w-full pt-2 pb-3 border-t border-red-500'></div>

              <div className='flex items-center justify-between'>
                <button
                  className='w-full px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  프로필 수정
                </button>
              </div>
              <div
                className={
                  message === ""
                    ? "hidden "
                    : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 rounded-md bg-slate-200"
                }
              >
                {message}
              </div>
            </form>
          </div>
        )}
        <ModalMessage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={"알림"}
          message={modalMsg}
        />
      </AdminLayout>
    </>
  );
};

export default ProfileEdit;

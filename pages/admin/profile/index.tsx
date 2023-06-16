import ModalMessage from "@components/Modals/ModalMessage";
import AdminLayout from "@components/layouts/AdminLayout";
import { Loading } from "@components/loading/Loading";
import { callAPI } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { CompanyModel } from "@libs/client/models/company.model";
import { UserModel } from "@libs/client/models/user.model";
import React, { useEffect, useState } from "react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState<UserModel>();
  const [message, setMessage] = useState("");

  const [showLoading, setShowLoading] = useState(false);

  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);

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
        setTimeout(() => {
          setMessage("");
          setShowLoading(false);
        }, 100);
      } else {
        setShowLoading(false);
      }
    }
  }, [loading]);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;

  //   setProfile({ ...profile, [name]: value });
  // };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowLoading(true);
    setMessage("진행중.....");
    setTimeout(() => {
      update(profile);
    }, 500);
  };

  useEffect(() => {
    // 나의 정보 불러 오기
    callAPI({ urlInfo: APIURLs.ME }).then((d) => {
      const user = d.json().then((d) => {
        setProfile(d.data);
      });
    });

    // 업체 리스트 불러오기
    callAPI({
      urlInfo: APIURLs.COMPANY_LIST,
      params: { size: 99999, page: 0 },
    }).then(async (d) => {
      const data = await d.json();
      setCompanyList(data.data.data);
    });
  }, []);

  return (
    <>
      <AdminLayout menuTitle='프로필 수정'>
        {showLoading && <Loading />}
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
                    className='w-full px-3 py-2 font-bold leading-tight text-gray-800 border rounded shadow appearance-none bg-slate-300 focus:outline-none focus:shadow-outline'
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
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='name'
                  >
                    이름
                  </label>
                  <input
                    className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='name'
                    name='name'
                    type='text'
                    value={profile ? profile.name : ""}
                    onChange={(v) => {
                      setProfile({ ...profile, name: v.target.value });
                    }}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    className='block mb-2 text-sm font-bold text-gray-700'
                    htmlFor='position'
                  >
                    직급
                  </label>
                  <input
                    className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id='position'
                    name='position'
                    type='text'
                    value={profile ? profile.position : ""}
                    onChange={(v) => {
                      setProfile({ ...profile, position: v.target.value });
                    }}
                  />
                </div>
                <div className='mb-4'>
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
              </div>
              <div className='mb-4'>
                <label
                  className='block mb-2 text-sm font-bold text-gray-700'
                  htmlFor='company'
                >
                  Company
                </label>
                <input
                  className='w-full px-3 py-2 font-bold leading-tight text-gray-800 border rounded shadow appearance-none bg-slate-300 focus:outline-none focus:shadow-outline'
                  disabled
                  value={profile ? profile.company : ""}
                />
                {/* <SelectBoxCompanyList
                  id='company'
                  onChange={(v: string) => {
                    setProfile({ ...profile, company: v });
                  }}
                  selectCompany={profile.company}
                /> */}
                {/* <select
                  className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                  id='company'
                  required={true}
                  onChange={(e) => {
                    setProfile({ ...profile, company: e.target.value });
                  }}
                >
                  {companyList.length > 0 &&
                    companyList.map((d, key) => {
                      return (
                        <option
                          key={d.id}
                          value={d.name}
                          selected={d.name === profile.company ? true : false}
                        >
                          {d.name}
                        </option>
                      );
                    })}
                </select> */}

                {/* <input
                  className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                  id='company'
                  name='company'
                  type='text'
                  value={profile ? profile.company : ""}
                  onChange={(v) => {
                    setProfile({ ...profile, company: v.target.value });
                  }}
                /> */}
              </div>

              <div
                className={
                  message === ""
                    ? "hidden "
                    : "flex justify-center p-2 m-4 font-bold text-red-500 border-2 rounded-md bg-slate-200"
                }
              >
                {message}
              </div>
              <div className='flex items-center justify-between'>
                <button
                  className='w-full px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  프로필 수정
                </button>
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

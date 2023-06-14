import { NextPage } from "next";
import { PageURLs, APIURLs } from "@libs/client/constants";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import ButtonLinkForPage from "@components/buttons/ButtonLink";
import { setToken } from "@libs/client/utils/token.utils";
import ModalMessage from "@components/Modals/ModalMessage";
import { Loading } from "@components/loading/Loading";

interface LoginForm {
  email?: string;
  password?: string;
}

const Login: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const { register, handleSubmit } = useForm<LoginForm>();
  const [login, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.LOGIN,
  });
  const router = useRouter();

  const onValid = (validForm: LoginForm) => {
    setShowLoading(true);
    if (loading) return;
    login(validForm);
  };

  useEffect(() => {
    // 로그인 요청에 따른 처리
    if (loading === false) {
      if (data?.ok) {
        setToken(data.data.sessionKey);
        router.push(PageURLs.MAIN);
      } else if (data?.ok === false) {
        setErrorMessage(data?.data.description.codeMessage);
        setIsOpen(true);
      }
    }
    setShowLoading(false);
  }, [loading, data, router]);

  return (
    <>
      {showLoading && <Loading />}
      <div className='h-screen py-40 bg-blueGray-800'>
        <div className='container h-full px-4 mx-auto'>
          <div className='flex items-center content-center justify-center h-full'>
            <div className='w-2/5'>
              <div className='relative flex flex-col w-full min-w-0 py-5 break-words border-0 rounded-lg rounded-t shadow-lg bg-blueGray-200'>
                <div className='flex-auto px-4 py-3 pt-0 ml-6 mr-6'>
                  <div className='mb-5 text-lg font-bold text-center text-blueGray-800'>
                    로그인
                  </div>
                  <form onSubmit={handleSubmit(onValid)}>
                    <div className='relative w-full mb-3'>
                      <label
                        className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                        htmlFor='grid-password'
                      >
                        Email
                      </label>
                      <input
                        type='email'
                        className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                        placeholder='Email'
                        id='email'
                        required={true}
                        {...register("email")}
                      />
                    </div>

                    <div className='relative w-full mb-3'>
                      <label
                        className='block mb-2 text-xs font-bold uppercase text-blueGray-600'
                        htmlFor='grid-password'
                      >
                        Password
                      </label>
                      <input
                        type='password'
                        className='w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                        placeholder='Password'
                        id='password'
                        {...register("password", { required: true })}
                      />
                    </div>
                    <div className='mt-6 text-center'>
                      <input
                        type='submit'
                        className='w-full px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none'
                        value={loading ? "Loading..." : "Sign In"}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalMessage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={"로그인 오류"}
          message={errorMessage}
        />
      </div>
    </>
  );
};

export default Login;

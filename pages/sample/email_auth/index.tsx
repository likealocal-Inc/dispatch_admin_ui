import { useEffect } from "react";
import useCallAPI from "@libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { InferGetServerSidePropsType } from "next";

type Data = {};

function EmailAuth({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const [callAPI, { loading, data, error }] = useCallAPI(URLs.AUTH_TOKEN);
  // useEffect(() => {
  //   callAPI({
  //     username: "hanblues@gmail.com",
  //     password: "1234",
  //   });
  // }, []);

  return <></>;
}

export const getServerSideProps = async (context: any) => {
  const data: Data = { godo: "godo" };
  // return { notFound: true };
  return {
    props: {
      data,
    }, // will be passed to the page component as props
  };
};

export default EmailAuth;

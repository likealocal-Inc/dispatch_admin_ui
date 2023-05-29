import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Button, Paper, Table, TableBody, TableContainer } from "@mui/material";

import AdminLayout from "@components/layouts/AdminLayout";
import useCallAPI from "@libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLType, APIURLs } from "@libs/client/constants";
import PaginavigationWidget from "@components/ListTable/Paginavigation";
import TableHeader from "@components/ListTable/TableHeader";
import { MessageProps, MessageShow } from "@components/MessageShow/show";
import Button01 from "../buttons/Button01";
import { Loading } from "@components/loading/Loading";

interface TableTemplatProps {
  pageSize?: number;
  title: string;
  headers: string[];
  headerWidths: number[];
  body: Function;
  listCallUrl: APIURLType;
  pageQueryWhere?: any;
  reload: number;
  message: MessageProps;
  setMessage: Function;
  onCreate?: Function;
}

export default function TableTemplate({
  pageSize = 10,
  title,
  headers,
  headerWidths,
  body,
  listCallUrl,
  message,
  setMessage,
  onCreate,
}: TableTemplatProps) {
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [res, setRes] = useState([]);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: listCallUrl,
  });

  /**
   * 데이터 변경이 있을경우 현재 페이지 재로딩
   */
  const pageReload = () => {
    call({
      size: pageSize,
      page,
    });
  };

  useEffect(() => {
    pageReload();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      if (data?.ok) {
        setRes(data.data.data);
        setTotalCount(data.data.count);
      }
    }
  }, [data, loading]);

  return (
    <>
      {loading && <Loading />}
      <AdminLayout menuTitle={title}>
        <div className='bg-gray-500'>
          {onCreate && (
            <div className='flex justify-end pt-2 pb-1 pr-2'>
              <Button
                variant='contained'
                className='w-24 mr-2 font-bold text-black bg-slate-300 hover:bg-amber-300 hover:text-black'
                onClick={() => onCreate()}
              >
                생성
              </Button>
            </div>
          )}
          <div className='flex flex-col'>
            <TableContainer component={Paper}>
              <Table aria-label='customized table'>
                <TableHeader headers={headers} headerWidth={headerWidths} />
                <TableBody>{body(res)}</TableBody>
              </Table>
            </TableContainer>

            {/* 페이지처리 */}
            <PaginavigationWidget
              page={page}
              setPage={setPage}
              call={call}
              size={pageSize}
              totalCount={totalCount}
            />
          </div>
        </div>
      </AdminLayout>

      {/* 메세지 */}
      <MessageShow setMessage={setMessage} message={message} />
    </>
  );
}

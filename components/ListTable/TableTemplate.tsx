import { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

import useCallAPI from "@libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLType, APIURLs } from "@libs/client/constants";
import PaginavigationWidget from "@components/ListTable/Paginavigation";
import TableHeader from "@components/ListTable/TableHeader";
import { MessageProps, MessageShow } from "@components/MessageShow/show";
import { Loading } from "@components/loading/Loading";
import {
  SelectBoxCompanyList,
  SelectBoxStatusList,
} from "@libs/client/utils/dispatch.ui.utils";

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

  const [condition, setCondition] = useState({});
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
      condition,
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
      <div className='bg-gray-500'>
        <div className='flex justify-between pt-2 pb-1 pr-2'>
          <div className='flex flex-row'>
            <div className='flex flex-row items-center w-auto pl-10'>
              <div className='font-bold text-white w-52'>배차상태:</div>
              <SelectBoxStatusList
                id='searchStatus'
                isSearch={true}
                onChange={(e: string) => {
                  setCondition({ ...condition, status: e });
                }}
              />
              <div className='w-32 font-bold text-white'>업체:</div>
              <SelectBoxCompanyList
                id='searchCompany'
                isSearch={true}
                onChange={(e: string) => {
                  setCondition({ ...condition, company: e });
                }}
              />
            </div>
            <button
              className='w-20 m-3 bg-green-400 rounded-lg hover:bg-green-900 hover:text-white'
              onClick={pageReload}
            >
              검색
            </button>
          </div>

          <div className='flex items-center'>
            {onCreate !== undefined ? (
              <button
                className='w-24 h-10 mr-2 font-bold text-white rounded-lg bg-slate-800 hover:bg-amber-300 hover:text-red-700'
                onClick={() => onCreate()}
              >
                생성
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
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

      {/* 메세지 */}
      <MessageShow setMessage={setMessage} message={message} />
    </>
  );
}

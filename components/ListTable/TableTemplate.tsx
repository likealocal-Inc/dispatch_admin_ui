import { useEffect, useState } from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";

import useCallAPI from "@libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLType, APIURLs, localstorageObj } from "@libs/client/constants";
import PaginavigationWidget from "@components/ListTable/Paginavigation";
import TableHeader from "@components/ListTable/TableHeader";
import { MessageProps, MessageShow } from "@components/MessageShow/show";
import { Loading } from "@components/loading/Loading";
import {
  SelectBoxCompanyList,
  SelectBoxStatusList,
} from "@libs/client/utils/dispatch.ui.utils";
import { UserModel } from "@libs/client/models/user.model";
import { ElseUtils } from "@libs/client/utils/else.utils";

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
  isShowSearch: boolean;
  reloadList?: number;
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
  isShowSearch = false,
  reloadList = 1,
}: TableTemplatProps) {
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [showLoading, setShowLoading] = useState(false);

  const [condition, setCondition] = useState({});
  const [res, setRes] = useState([]);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: listCallUrl,
  });

  // 사용자 정보
  const [user, setUser] = useState<UserModel>();
  /**
   * 데이터 변경이 있을경우 현재 페이지 재로딩
   */
  const pageReload = () => {
    call({
      size: pageSize,
      page,
      condition,
      isAllList: true,
    });
  };

  useEffect(() => {
    setShowLoading(true);
    setTimeout(() => {
      pageReload();
      setShowLoading(false);
    }, 300);
  }, [reloadList]);

  useEffect(() => {
    pageReload();

    setTimeout(() => {
      const _user = ElseUtils.getUserFromLocalStorage();

      // B2B업체가 아니라면 회사검색을 활성화한다.
      if (_user?.role !== "USER") {
        const showCompany = document.getElementById("showCompany");
        if (showCompany !== null) showCompany!.style.display = "block";
      }
    }, 300);
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
      {showLoading && <Loading />}
      <div className='bg-gray-500'>
        <div className='flex justify-between pt-2 pb-1 pr-2'>
          {isShowSearch ? (
            <div className='flex flex-row w-full'>
              <div className='flex flex-row items-center justify-start'>
                <div className='flex flex-row items-center justify-start w-64 pl-10'>
                  <div className='w-20 font-bold text-white'>상태:</div>
                  <div className='px-2'>
                    <SelectBoxStatusList
                      id='searchStatus'
                      isSearch={true}
                      onChange={(e: string) => {
                        setCondition({ ...condition, status: e });
                      }}
                    />
                  </div>
                </div>

                <div className='hidden' id='showCompany'>
                  <div className='flex flex-row items-center w-64 pl-5'>
                    <div className='w-12 font-bold text-white'>업체:</div>
                    <div className=''>
                      <SelectBoxCompanyList
                        id='searchCompany'
                        isSearch={true}
                        onChange={(e: string) => {
                          setCondition({ ...condition, company: e });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                className='w-20 m-3 font-bold bg-green-300 rounded-lg hover:bg-green-800 hover:text-white'
                onClick={pageReload}
              >
                검색
              </button>
            </div>
          ) : (
            <div className=''></div>
          )}

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
            condition={condition}
          />
        </div>
      </div>

      {/* 메세지 */}
      <MessageShow setMessage={setMessage} message={message} />
    </>
  );
}

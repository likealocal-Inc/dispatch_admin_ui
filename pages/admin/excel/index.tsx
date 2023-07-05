import AdminLayout from "@components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Datepicker from "react-tailwindcss-datepicker";
import { callAPI, callList } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { ElseUtils } from "@libs/client/utils/else.utils";
import sleep from "sleep-promise";

export default function Excel() {
  const [value, setValue] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [isLaoding, setIsLaoding] = useState(false);
  const [condition, setCondition] = useState("1");
  const [period, setPeriod] = useState({ start: "", end: "" });
  const handleValueChange = (newValue: any) => {
    setPeriod({ start: newValue.startDate, end: newValue.endDate });
  };

  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    setUser(ElseUtils.getUserFromLocalStorage());
    setValue({ startDate: "", endDate: "" });
  }, []);

  const downloadExcel = async () => {
    if (
      period.start === "" ||
      period.start === null ||
      period.end === "" ||
      period.end == null
    ) {
      alert("날짜를 선택해주세요");
      return;
    }
    setIsLaoding(true);
    const res = await callAPI({
      urlInfo: APIURLs.SEARCH_FOR_EXCEL,
      params: { start: period.start, end: period.end, type: condition },
    });

    const data = await res.json();

    await sleep(500);

    if (data["jin"].length === 0 && data["iw"].length === 0) {
      alert("데이터가 없습니다.");
      setIsLaoding(false);
      return;
    }

    const fileName = `[${user?.email}]_${Date.now()}`;

    const worksheet = XLSX.utils.json_to_sheet(data["jin"]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `jin-${fileName}.xlsx`);

    await sleep(1000);

    const worksheet2 = XLSX.utils.json_to_sheet(data["iw"]);
    const workbook2 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook2, worksheet2, "Sheet1");
    XLSX.writeFile(workbook2, `iam-${fileName}.xlsx`);

    setIsLaoding(false);
  };

  if (user === undefined || user.role === "USER") {
    return <></>;
  }
  return (
    <>
      {isLaoding ? (
        <div className='absolute top-0 left-0 z-50 w-full h-full bg-slate-600 bg-opacity-95'>
          <div className='flex items-center justify-center text-center mx-72 my-72'>
            <div className='text-center'>
              <div role='status'>
                <svg
                  aria-hidden='true'
                  className='inline mr-2 text-gray-200 w-44 h-44 animate-spin dark:text-gray-600 fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <AdminLayout menuTitle={"엑셀다운로드"}>
        <div className='w-screen h-screen p-24 bg-gray-500'>
          <div className='px-9 text-white text-[30px]'>
            <div className='text-[30px] font-sans pl-[40px]'>엑셀다운로드</div>
            <div className='mb-[20px]'></div>
            <div className='flex items-center'>
              <select
                id='condition'
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-40 p-5 text-[20px] font-sans font-bold'
                onChange={(e) => {
                  setCondition(e.target.value);
                }}
              >
                <option value='1' selected>
                  주문생성일
                </option>
                <option value='2'>탑승일</option>
              </select>
              <div className='relative w-75 ml-[20px] z-20'>
                <Datepicker
                  showFooter={true}
                  showShortcuts={true}
                  primaryColor={"fuchsia"}
                  value={value}
                  onChange={handleValueChange}
                  inputClassName='p-5 rounded-lg w-[300px] font-bold'
                />
              </div>
              <button
                type='button'
                className='focus:outline-none text-white bg-slate-800 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm w-[100px] h-[60px] ml-[20px]'
                onClick={(e) => {
                  downloadExcel();
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

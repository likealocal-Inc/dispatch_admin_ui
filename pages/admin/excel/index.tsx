import AdminLayout from "@components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Datepicker from "react-tailwindcss-datepicker";
import { callAPI, callList } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { ElseUtils } from "@libs/client/utils/else.utils";

export default function Excel() {
  const [value, setValue] = useState<any>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [isLaoding, setIsLaoding] = useState(false);
  const [condition, setCondition] = useState("1");
  const [period, setPeriod] = useState({ start: "", end: "" });
  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    setPeriod({ start: newValue.startDate, end: newValue.endDate });
  };

  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    setUser(ElseUtils.getUserFromLocalStorage());
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

    const res = await callAPI({
      urlInfo: APIURLs.SEARCH_FOR_EXCEL,
      params: { start: period.start, end: period.end, type: condition },
    });

    const data = await res.json();

    console.log(data);

    const fileName = `[${user?.email}]_${Date.now()}`;

    const worksheet = XLSX.utils.json_to_sheet(data["jin"]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `jin-${fileName}.xlsx`);

    const worksheet2 = XLSX.utils.json_to_sheet(data["iw"]);
    const workbook2 = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook2, worksheet2, "Sheet1");
    XLSX.writeFile(workbook2, `iam-${fileName}.xlsx`);
  };

  if (isLaoding) {
    return <></>;
  }
  return (
    <>
      <AdminLayout menuTitle={"엑셀다운로드"}>
        <div className='h-screen p-5 bg-gray-500'>
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
              <div className='relative w-75 ml-[20px]'>
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

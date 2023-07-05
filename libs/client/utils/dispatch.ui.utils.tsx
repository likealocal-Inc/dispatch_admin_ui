import { Button, Card, TextField, Typography } from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { DispatchUtils, EnumDispatchStatus } from "./dispatch.utils";
import { callAPI } from "../call/call";
import { APIURLs } from "../constants";
import { CompanyModel } from "../models/company.model";
import { getHTMLElementByID, getSelctOptionValue } from "./html.utils";
import { DateUtils } from "@libs/date.utils";
import { DispatchModel } from "../models/dispatch.model";
import { OrderModel } from "../models/order.model";

export enum UIType {
  CREATE,
  MODIFY,
  DISPATCH,
}

const airportList = ["인천1공항", "인천2공항", "김포공항"];
export const airportSelectTag = (id: string, isSelect?: string) => {
  return (
    <>
      <select className='w-full m-3 rounded-lg' id={id}>
        {airportList.map((d, k) => (
          <option key={k} value={d} selected={isSelect === d ? true : false}>
            {d}
          </option>
        ))}
      </select>
    </>
  );
};

export function InfoBox({ info }: any) {
  return (
    <div className='flex items-center justify-center w-full h-full px-4 m-2 rounded-lg bg-slate-300'>
      <div
        className='text-sm'
        dangerouslySetInnerHTML={{
          __html: `${info}`,
        }}
      ></div>
    </div>
  );
}
export function InfoBoxWithTitle({ title, info, updateData = "" }: any) {
  return (
    <div className={`flex flex-row items-center my-1 w-80`}>
      <div
        className={
          `w-24 text-sm ` +
          (updateData !== "" ? "text-orange-600 font-bold " : "")
        }
      >
        {title}
      </div>
      <InfoBox
        info={
          `${info}` + (updateData !== "" ? `<br/>[<b>${updateData}</b>]` : "")
        }
      />
    </div>
  );
}

export const orderTypeList = ["공항픽업", "공항샌딩", "시간대절", "편도예약"];

// 사용자 정보 출력 컴포넌트
export function UserInfomation({ me }: any) {
  return (
    <>
      <InfoBoxWithTitle title='소속' info={me?.company} />
      <InfoBoxWithTitle title='직급' info={me?.position} />
      <InfoBoxWithTitle title='이름' info={me?.name} />
      <InfoBoxWithTitle title='번호' info={me?.phone} />
      <InfoBoxWithTitle title='이메일' info={me?.email} />
    </>
  );
}

// 다음 주소
export function MyDaumPostcode({ isDisplay, onComplete, onClose }: any) {
  const [ttt, setTTT] = useState("no");
  useEffect(() => {
    setTimeout(() => {
      setTTT(isDisplay ? "ok" : "no");
    }, 100);
  }, [isDisplay]);

  return (
    <>
      {ttt === "ok" ? (
        <div
          className={
            isDisplay
              ? `fixed inset-0 items-center justify-center bg-slate-700 bg-opacity-60`
              : "hidden"
          }
        >
          <div className='flex flex-col items-center justify-center w-full h-full'>
            <div className=''>
              <div className='flex justify-end'>
                <button
                  className='w-10 p-2 mr-2 text-center text-red-600 bg-green-500 rounded-lg'
                  onClick={() => onClose()}
                >
                  X
                </button>
              </div>
              <DaumPostcode
                style={{
                  width: "800px",
                  height: "600px",
                  border: "2px solid #000",
                  boxShadow: "24",
                }}
                onComplete={onComplete}
                onClose={() => {
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export function LocationAndAddress({
  title,
  selectType,
  orderType,
  uiType,
  address,
  setAddress,
  setIsAddressSearchShow,
  locationStr,
  locationObj,
}: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>{title}명</div>
        {selectType === orderType ? (
          <>
            {uiType === UIType.MODIFY
              ? airportSelectTag(locationStr, locationObj)
              : airportSelectTag(locationStr)}
          </>
        ) : (
          <div className='w-full m-1'>
            <TextField
              id={locationStr}
              defaultValue={uiType === UIType.MODIFY ? locationObj : ""}
              className='w-full'
            />
          </div>
        )}
      </div>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>{title}주소</div>
        <div className='w-full m-1'>
          {selectType === orderType ? (
            <>
              <TextField
                value={selectType}
                className='w-full text-sm bg-slate-300'
                disabled
              />
            </>
          ) : (
            <div className='flex flex-row'>
              <TextField
                value={address}
                defaultValue={address}
                className='w-full text-sm'
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                className='w-20 ml-2 rounded-lg bg-slate-400'
                onClick={() => setIsAddressSearchShow(true)}
              >
                조회
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function InfomationComponent({
  uiType,
  information,
  isIamweb,
  setInformation,
  updateData,
}: any) {
  const [infoDataJson, setInfoDataJson] = useState<any>();

  useEffect(() => {
    if (information === undefined || information === "") return;
    let infos = information;
    // 수정모드 - 배차입력모드
    if (uiType === UIType.MODIFY || uiType === UIType.DISPATCH) {
      // 아임웹 일경우 - json처리
      if (isIamweb) {
        infos = JSON.parse(information);
      } else {
        infos = information;
      }
    }
    setInfoDataJson(infos);
  }, [information]);

  useEffect(() => {}, [setInfoDataJson]);
  return (
    <>
      <div className='flex flex-row items-center w-full'>
        <div
          className={
            `w-28 text-sm ` +
            (uiType === UIType.DISPATCH &&
            updateData !== undefined &&
            updateData.information !== ""
              ? "text-orange-600 font-bold "
              : "")
          }
        >
          전달사항
        </div>
        <div className='w-full p-2 '>
          {
            // 전달사항 출력처리
            // 아임웹 -> json처리 해야 함
            isIamweb === true && infoDataJson !== undefined ? (
              <>
                <div className='flex flex-row w-full'>
                  <div className='w-full'>
                    {Object.keys(infoDataJson).map((d) => {
                      const url = `http://101.33.73.252:9999/api/airport/view/${infoDataJson[d]}`;
                      return (
                        <div
                          key={d}
                          className='flex flex-row justify-between w-full'
                        >
                          <div className='w-44 p-2 m-1 text-sm rounded-lg bg-slate-200 overflow-y-auto whitespace-pre scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                            {d === "비행편" ? (
                              <a
                                href={url}
                                target='_blank'
                                rel='noreferrer'
                                className='text-red-600'
                              >
                                {d}
                              </a>
                            ) : (
                              d
                            )}
                          </div>
                          {
                            // 배차처리 -> 출력만함
                            uiType === UIType.DISPATCH ? (
                              d === "기타" ? (
                                <div className='w-72 h-48 p-2 m-1 text-sm bg-white word-break:break-all border-2 rounded-lg overflow-y-auto  scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                                  {infoDataJson[d]}
                                </div>
                              ) : (
                                <div className='w-72 p-2 m-1 text-sm bg-white border-2 rounded-lg overflow-y-auto whitespace-pre scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                                  {infoDataJson[d]}
                                </div>
                              )
                            ) : d === "기타" ? (
                              <textarea
                                id={d}
                                defaultValue={infoDataJson[d]}
                                className='p-2 m-1 text-sm bg-white border-2 rounded-lg w-[450px]'
                                onChange={(e) => {
                                  const div = document.getElementById(d);
                                  div!.innerHTML = e.target.value;
                                  infoDataJson[d] = e.target.value;
                                  setInformation(JSON.stringify(infoDataJson));
                                }}
                                rows={4}
                              />
                            ) : (
                              <input
                                id={d}
                                defaultValue={infoDataJson[d]}
                                className='p-2 m-1 text-sm bg-white border-2 rounded-lg w-[450px]'
                                onChange={(e) => {
                                  const div = document.getElementById(d);
                                  div!.innerHTML = e.target.value;
                                  infoDataJson[d] = e.target.value;
                                  setInformation(JSON.stringify(infoDataJson));
                                }}
                              />
                            )
                          }
                        </div>
                      );
                    })}
                    {/* <div className='hidden'>
                  <TextField id='infomation' value={infoDataJson} />
                </div> */}
                  </div>
                  {uiType === UIType.DISPATCH &&
                  updateData !== undefined &&
                  updateData.information !== "" ? (
                    <>
                      <div className='w-full'>
                        {Object.keys(JSON.parse(updateData.information)).map(
                          (d) => {
                            return (
                              <div
                                key={d}
                                className='flex flex-row justify-between'
                              >
                                {d === "기타" ? (
                                  <div className='p-2 m-1 text-sm bg-orange-100 border-2 rounded-lg w-64 h-48 overflow-y-auto whitespace-pre  scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                                    {JSON.parse(updateData.information)[d]}
                                  </div>
                                ) : (
                                  // 배차처리 -> 출력만함
                                  <div className='p-2 m-1 text-sm bg-orange-100 border-2 rounded-lg w-64 h-10 overflow-y-auto whitespace-pre  scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                                    {JSON.parse(updateData.information)[d]}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : // 업체에서 배차요청한 데이터일경우 배차처리시 화면에 출력만 함
            uiType === UIType.DISPATCH ? (
              <>
                <div className='flex flex-row'>
                  {updateData !== undefined && updateData.information !== "" ? (
                    <>
                      <div className='w-72 h-48 p-3 overflow-y-auto whitespace-pre rounded-lg bg-slate-300 scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                        {infoDataJson}
                      </div>
                      <div className='w-72 h-48 p-3 ml-2 overflow-y-auto whitespace-pre bg-orange-100 rounded-lg scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                        {updateData.information}
                      </div>
                    </>
                  ) : (
                    <div className='w-[580px] h-48 p-3 overflow-y-auto whitespace-pre rounded-lg bg-slate-300 scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                      {infoDataJson}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <TextField
                id='infomation'
                defaultValue={
                  uiType === UIType.MODIFY
                    ? infoDataJson
                    : "■ 탑승자수:\n■ 차량 유형(화이트/블랙):\n■ 정산방식(후불정산/현장결제(카드)/문자결제):\n■ 수화물수:\n■ 경유지:\n■ 경유지주소:\n■ 국적:\n■ 기타:"
                }
                className='w-full text-sm overflow-y-scroll scrollbar-w-[2px] scrollbar-thumb-gray-300 scrollbar-track-gray-100'
                multiline
                rows={6}
                onChange={(d) => {
                  setInformation(d.target.value);
                }}
              />
            )
          }
        </div>
      </div>
    </>
  );
}

// https://reactdatepicker.com/#example-custom-time-input
export function BoardingDateComponent({ startDate, setStartDate }: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='w-28'>탑승일시</div>
        <div className='w-full m-1'>
          <DatePicker
            className='rounded-lg'
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={5}
            timeCaption='time'
            dateFormat='yyyy/MM/dd h:mm aa'
          />
        </div>
      </div>
    </>
  );
}

export function DispatchProcessInfo({
  title,
  value,
  id,
  isNumber = false,
  isModify = true,
}: any) {
  const [val, setVal] = useState("");

  useEffect(() => {
    setVal(value);
  }, [value]);

  return (
    <div className='flex flex-row items-center w-56'>
      <div className='w-24'>{title}</div>
      <div className='w-full m-1'>
        {isModify ? (
          <input
            id={id}
            defaultValue={val}
            className='w-full p-2 border-dashed rounded-lg '
            type={isNumber ? "number" : "text"}
          />
        ) : (
          <div className='w-full p-2 border-2 border-dashed rounded-lg h-9'>
            {val}
          </div>
        )}
      </div>
    </div>
  );
}

export function DispatchProcessInfoPrice({
  title,
  value,
  setValue,
  id,
  isModify = true,
}: any) {
  return (
    <div className='flex flex-row items-center w-56'>
      <div className='w-24'>{title}</div>
      <div className='w-full m-1'>
        {isModify ? (
          <input
            id={id}
            value={value}
            className='w-full p-2 border-dashed rounded-lg '
            type='number'
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        ) : (
          <div className='w-full p-2 border-2 border-dashed rounded-lg h-9'>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

export function DispatchProcessInfoTotalPrice({
  title,
  value,
  id,
  isModify = true,
}: any) {
  return (
    <div className='flex flex-row items-center w-56'>
      <div className='w-24'>{title}</div>
      <div className='w-full m-1'>
        {isModify ? (
          <input
            disabled
            id={id}
            value={value}
            className='w-full p-2 border-dashed rounded-lg '
            type='number'
            // onChange={(e) => {
            //   const res = +e.target.value - val;
            //   setValue(value + res);
            // }}
          />
        ) : (
          <div className='w-full p-2 border-2 border-dashed rounded-lg h-9'>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

// 회사 리트스
export function SelectBoxCompanyList({
  id,
  onChange,
  isSearch = false,
  selectCompany = "NONE",
  required = false,
}: any) {
  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);
  useEffect(() => {
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
    <select
      className='w-full rounded-lg'
      id={id}
      required={required}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      {isSearch === true ? (
        <option key={"0"} value='ALL'>
          ALL
        </option>
      ) : (
        ""
      )}
      {companyList.length > 0 &&
        companyList.map((d, key) => {
          return (
            <option
              key={d.id}
              value={d.name}
              selected={d.name === selectCompany ? true : false}
            >
              {d.name}
            </option>
          );
        })}
    </select>
  );
}

// 상태값 선택박스
export function SelectBoxStatusList({
  id,
  isSearch = false,
  onChange,
  selectStatus = "NONE",
}: any) {
  return (
    <select
      className='w-full m-3 rounded-lg'
      id={id}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      disabled={selectStatus === EnumDispatchStatus.DONE ? true : false}
    >
      {isSearch === true ? (
        <option key={"0"} value='ALL'>
          ALL
        </option>
      ) : (
        ""
      )}
      <option key={"IAMWEB_ORDER"} value='IAMWEB_ORDER'>
        아임웹주문
      </option>
      {DispatchUtils.statusList.map((d, k) => {
        return (
          <option
            key={k}
            value={d}
            selected={d === selectStatus ? true : false}
          >
            {DispatchUtils.status.get(d)}
          </option>
        );
      })}
    </select>
  );
}

export function IamWebTimeOrderInputBox({ title, id, value }: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>{title}</div>
        <div className='w-full m-1'>
          <TextField id={id} defaultValue={value} className='w-full' />
        </div>
      </div>
    </>
  );
}

export function GapWidthForDispatchInput({ num }: any) {
  return (
    <>
      <div className='w-4' />
    </>
  );
}

// 배차정보 입력 컴포넌트
export function DispatchInfoInput({
  dispatch,
  order,
  isModify,
  setMessage,
  handleModalClose,
  onSubmitDispatch,
}: any) {
  const [totalPrice, setTotalPrice] = useState(0);

  const [baseFare, setBaseFare] = useState(0);
  const [addFare, setAddFare] = useState(0);
  const [exceedFare, setExceedFare] = useState(0);

  useEffect(() => {
    if (dispatch !== undefined) {
      // setTotalPrice(dispatch.totalFare === undefined ? 0 : dispatch.totalFare);
      setBaseFare(dispatch.baseFare === undefined ? 0 : dispatch.baseFare);
      setAddFare(dispatch.addFare === undefined ? 0 : dispatch.addFare);
      setExceedFare(
        dispatch.exceedFare === undefined ? 0 : dispatch.exceedFare
      );
      setTotalPrice(+baseFare + +addFare + +exceedFare);
    }
  }, [dispatch]);

  useEffect(() => {
    setTotalPrice(+baseFare + +addFare + +exceedFare);
  }, [baseFare, addFare, exceedFare]);

  return (
    <>
      <Card className='p-1 w-[500px] pb-5 ml-3 rounded-lg'>
        <div className='flex flex-row'>
          <div className='flex flex-col p-3'>
            <div className='flex flex-row'>
              <DispatchProcessInfo
                title='운수사'
                id='carCompany'
                value={dispatch ? dispatch.carCompany : ""}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <div className='flex flex-row items-center w-56'>
                <div className='w-28'>상태값</div>
                {isModify ? (
                  <SelectBoxStatusList
                    id='dispatchStatus'
                    selectStatus={order?.status}
                    onChange={(d: any) => {}}
                  />
                ) : (
                  <>
                    <div className='w-full p-2 border-2 rounded-lg'>
                      {order
                        ? DispatchUtils.status.get(order.status)
                        : "loading.."}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className='flex flex-row'>
              <DispatchProcessInfo
                title='지니명'
                id='jiniName'
                value={dispatch ? dispatch.jiniName : ""}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <DispatchProcessInfo
                title='연락처'
                id='jiniPhone'
                value={dispatch ? dispatch.jiniPhone : ""}
                isModify={isModify}
              />
            </div>
            <div className='flex flex-row'>
              <DispatchProcessInfo
                title='차량정보'
                id='carInfo'
                value={dispatch ? dispatch.carInfo : ""}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <select className='my-3 rounded-lg' id='carType'>
                <option
                  value='블랙'
                  selected={dispatch?.carType === "블랙" ? true : false}
                >
                  블랙
                </option>
                <option
                  value='화이트'
                  selected={dispatch?.carType === "화이트" ? true : false}
                >
                  화이트
                </option>
              </select>
            </div>
            <div className='flex flex-row'>
              <DispatchProcessInfoPrice
                title='기본요금'
                id='baseFare'
                value={baseFare}
                setValue={setBaseFare}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <DispatchProcessInfoPrice
                title='추가요금'
                id='addFare'
                value={addFare}
                setValue={setAddFare}
                isModify={isModify}
              />
            </div>
            <div className='flex flex-row'>
              <DispatchProcessInfoPrice
                title='초과요금'
                id='exceedFare'
                value={exceedFare}
                setValue={setExceedFare}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <DispatchProcessInfoTotalPrice
                title='요금총합'
                id='totalFare'
                value={totalPrice}
                isModify={isModify}
              />
            </div>
            <div className='flex flex-row items-center w-56'>
              <div className='w-28'>결제타입</div>
              <select className='w-full my-3 rounded-lg' id='payType'>
                <option
                  value='카드'
                  selected={dispatch?.payType === "카드" ? true : false}
                >
                  카드
                </option>
                <option
                  value='직접결제'
                  selected={dispatch?.payType === "직접결제" ? true : false}
                >
                  직접결제
                </option>
                <option
                  value='후불'
                  selected={dispatch?.payType === "후불" ? true : false}
                >
                  후불
                </option>
              </select>
            </div>
            <div className='flex flex-col p-1'>
              <div className='p-2'>메모</div>
              <textarea
                name='memo'
                id='memo'
                cols={10}
                rows={10}
                defaultValue={dispatch ? dispatch.memo : ""}
                className='w-full h-48 rounded-lg'
              ></textarea>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='flex justify-end px-2 mt-2'>
            {isModify ? (
              <>
                <button
                  className='w-full p-2 mr-2 text-white bg-gray-700 rounded-lg'
                  onClick={() => {
                    setMessage("");
                    handleModalClose();
                  }}
                >
                  취소
                </button>
                <button
                  className='w-full p-2 mr-2 text-white bg-gray-700 rounded-lg hover:bg-gray-900'
                  onClick={() => {
                    onSubmitDispatch();
                  }}
                >
                  저장
                </button>
              </>
            ) : (
              <button
                className='w-full p-2 mr-2 text-white bg-gray-700 rounded-lg'
                onClick={() => {
                  setMessage("");
                  handleModalClose();
                }}
              >
                확인
              </button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

// 상태값 변경
export function onStatusUpdate({
  order,
  status,
  handleModalClose,
  setReloadList,
}: any) {
  callAPI({
    urlInfo: APIURLs.ORDER_STATUS_UPDATE,
    addUrlParams: `/${order!.id}/${status}`,
  })
    .then((d) => d.json())
    .then((d) => {
      if (d.ok === true) {
        handleModalClose(true);
        setReloadList(Date.now() * 1);
      }
    });
}

// 배차정보 저장하기
export function onSubmitDispatch({
  dispatch,
  order,
  setMessage,
  handleModalClose,
  setReloadList,
}: any) {
  const dispatchStatus = getSelctOptionValue("dispatchStatus");

  let isUpdateSatatus = false;

  // 배차 완료가 아닐경우는 데이터 확인이 필요 없음
  if (dispatchStatus !== order.status) {
    isUpdateSatatus = true;
    onStatusUpdate({
      order,
      status: dispatchStatus,
      handleModalClose,
      setReloadList,
    });
  }

  // } else {
  const carCompany = getHTMLElementByID<HTMLInputElement>("carCompany").value;
  const jiniName = getHTMLElementByID<HTMLInputElement>("jiniName").value;
  const carInfo = getHTMLElementByID<HTMLInputElement>("carInfo").value;
  const jiniPhone = getHTMLElementByID<HTMLInputElement>("jiniPhone").value;
  const _baseFare = getHTMLElementByID<HTMLInputElement>("baseFare").value;
  const _addFare = getHTMLElementByID<HTMLInputElement>("addFare").value;
  const _totalFare = getHTMLElementByID<HTMLInputElement>("totalFare").value;

  // 2023.06.09 추가
  const _exceedFare = getHTMLElementByID<HTMLInputElement>("exceedFare").value;
  const carType = getSelctOptionValue("carType");
  const payType = getSelctOptionValue("payType");
  const memo = getHTMLElementByID<HTMLTextAreaElement>("memo").value;

  const baseFare = _baseFare === "" ? 0 : +_baseFare;
  const addFare = _addFare === "" ? 0 : +_addFare;
  const totalFare = _totalFare === "" ? 0 : +_totalFare;
  const exceedFare = _exceedFare === "" ? 0 : +_exceedFare;

  if (dispatch.noData === true) {
    dispatch.carCompany = "";
    dispatch.jiniName = "";
    dispatch.carInfo = "";
    dispatch.jiniPhone = "";
    dispatch.carType = "블랙";
    dispatch.payType = "카드";
    dispatch.memo = "";
    dispatch.baseFare = 0;
    dispatch.addFare = 0;
    dispatch.totalFare = 0;
    dispatch.exceedFare = 0;
  }

  // console.log(
  //   carCompany,
  //   jiniName,
  //   carInfo,
  //   jiniPhone,
  //   carType,
  //   payType,
  //   memo,
  //   baseFare,
  //   addFare,
  //   totalFare,
  //   exceedFare
  // );
  // console.log(
  //   dispatch.carCompany,
  //   dispatch.jiniName,
  //   dispatch.carInfo,
  //   dispatch.jiniPhone,
  //   dispatch.carType,
  //   dispatch.payType,
  //   dispatch.memo,
  //   dispatch.baseFare,
  //   dispatch.addFare,
  //   dispatch.totalFare,
  //   dispatch.exceedFare
  // );

  if (
    dispatch.carCompany !== carCompany ||
    dispatch.jiniName !== jiniName ||
    dispatch.carInfo !== carInfo ||
    dispatch.jiniPhone !== jiniPhone ||
    dispatch.carType !== carType ||
    dispatch.payType !== payType ||
    dispatch.memo !== memo ||
    dispatch.baseFare !== baseFare ||
    dispatch.addFare !== addFare ||
    dispatch.totalFare !== totalFare ||
    dispatch.exceedFare !== exceedFare
  ) {
    if (dispatch.noData === true) {
      callAPI({
        urlInfo: APIURLs.DISPATCH_CREATE,
        params: {
          carCompany,
          jiniName,
          carInfo,
          jiniPhone,
          baseFare,
          addFare,
          totalFare,
          else01: "",
          else02: "",
          else03: "",
          orderId: order!.id,
          dispatchStatus:
            dispatchStatus === order!.status ? "" : dispatchStatus,

          // 2023.06.09 추가
          carType,
          payType,
          memo,
          exceedFare,
        },
      })
        .then((d) => d.json())
        .then((d) => {
          handleModalClose(true);
          setReloadList(Date.now() * 1);
        });
    } else {
      callAPI({
        urlInfo: APIURLs.DISPATCH_UPDATE,
        addUrlParams: `/${dispatch!.id}`,
        params: {
          carCompany,
          jiniName,
          carInfo,
          jiniPhone,
          baseFare,
          addFare,
          totalFare,
          else01: "",
          else02: "",
          else03: "",
          orderId: order!.id,
          dispatchStatus:
            dispatchStatus === order!.status ? "" : dispatchStatus,
          // 2023.06.09 추가
          carType,
          payType,
          memo,
          exceedFare,
        },
      })
        .then((d) => d.json())
        .then((d) => {
          handleModalClose(true);
          setReloadList(Date.now() * 1);
        });
    }
  } else {
    if (!isUpdateSatatus) {
      alert("변경된 데이터가 없음");
    }

    return;
  }
  // }
}

// 배차처리에 출발지명, 출발지주소, 도착지, 도착지 주소 출력
export function DispatchStartGoalLocationShowUI({ order, updateData }: any) {
  return (
    <>
      <InfoBoxWithTitle
        title='출발지명'
        info={order?.startLocation}
        updateData={updateData?.startLocation}
      />
      <InfoBoxWithTitle
        title='출발지주소'
        info={order?.startAddress}
        updateData={updateData?.startAddress}
      />
      <InfoBoxWithTitle
        title='도착지'
        info={order?.goalLocation}
        updateData={updateData?.goalLocation}
      />
      <InfoBoxWithTitle
        title='도착지주소'
        info={order?.goalAddress}
        updateData={updateData?.goalAddress}
      />
    </>
  );
}

export function DispatchStartGoalLocationInputUI({
  order,
  selectType,
  uiType,
  orderTypeList,
  startAddress,
  setIsStartAddressSearchShow,
  goalAddress,
  setIsGoalAddressSearchShow,
  setStartAddress,
  setGoalAddress,
}: any) {
  return (
    <>
      <LocationAndAddress
        title={"출발지"}
        selectType={selectType}
        orderType={orderTypeList[0]}
        uiType={uiType}
        address={startAddress}
        setAddress={setStartAddress}
        setIsAddressSearchShow={setIsStartAddressSearchShow}
        locationStr={"startLocation"}
        locationObj={order?.startLocation}
      />
      <LocationAndAddress
        title={"도착지"}
        selectType={selectType}
        orderType={orderTypeList[1]}
        uiType={uiType}
        address={goalAddress}
        setAddress={setGoalAddress}
        setIsAddressSearchShow={setIsGoalAddressSearchShow}
        locationStr={"goalLocation"}
        locationObj={order?.goalLocation}
      />
    </>
  );
}

// 시간대절 출발지 도착지 여행루트 시간대절정보 출력
export function DispatchStartGoalRouteTimezonShowUI({
  iamwebTimeOrderInfo,
  updateData,
}: any) {
  return (
    <>
      <InfoBoxWithTitle
        title='출발지/도착지'
        info={iamwebTimeOrderInfo["start_goal"]}
      />
      <InfoBoxWithTitle
        title='여행루트'
        info={iamwebTimeOrderInfo["trip_route"]}
      />
      <InfoBoxWithTitle
        title='시간대절'
        info={iamwebTimeOrderInfo["timezon"]}
      />
    </>
  );
}

// 시간대절 출발지 도착지 여행루트 시간대절정보 수정
export function DispatchStartGoalRouteTimezonInputUI({
  iamwebTimeOrderInfo,
}: any) {
  return (
    <>
      <IamWebTimeOrderInputBox
        id='start_goal'
        title='출발지/도착지'
        value={iamwebTimeOrderInfo["start_goal"]}
      />
      <IamWebTimeOrderInputBox
        id='trip_route'
        title='여행루트'
        value={iamwebTimeOrderInfo["trip_route"]}
      />
      <IamWebTimeOrderInputBox
        id='timezon'
        title='시간대절'
        value={iamwebTimeOrderInfo["timezon"]}
      />
    </>
  );
}

// 탑승자명, 연락처 출력
export function CustomNamePhoneShowUI({ order, updateData }: any) {
  return (
    <>
      <InfoBoxWithTitle
        title='탑승자이름'
        info={order?.customName}
        updateData={updateData?.customName}
      />
      <InfoBoxWithTitle
        title='탑승자번호'
        info={order?.customPhone}
        updateData={updateData?.customPhone}
      />
    </>
  );
}

// 탑승자명, 연락처 수정
export function CustomNamePhoneInputUI({ uiType, order }: any) {
  return (
    <>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>탑승자명</div>
        <div className='w-full m-1'>
          <TextField
            id='customName'
            defaultValue={uiType === UIType.MODIFY ? order?.customName : ""}
            className='w-full'
          />
        </div>
      </div>
      <div className='flex flex-row items-center w-96'>
        <div className='text-sm w-28'>탑승자번호</div>
        <div className='w-full m-1'>
          <TextField
            id='customPhone'
            defaultValue={uiType === UIType.MODIFY ? order?.customPhone : ""}
            className='w-full'
          />
        </div>
      </div>
    </>
  );
}

// 헤드 타이틀
export function HeaderUI({
  order,
  closeAddressModal,
  setReloadList,
  handleModalClose,
  uiType,
}: any) {
  return (
    <>
      <Typography id='transition-modal-title' variant='h6' component='h2'>
        <div
          className='flex flex-row items-center justify-center p-2 font-bold text-center text-gray-800'
          onClick={closeAddressModal}
        >
          <div className='pr-10 text-3xl'>
            {uiType === UIType.DISPATCH
              ? "배차처리"
              : uiType === UIType.MODIFY
              ? "배차수정"
              : "배차생성"}
          </div>

          {
            // 수정모드 - 아임웹 - 아직 배차전일 경우 버튼 활성화
            uiType === UIType.MODIFY &&
            order?.isIamweb &&
            order.status === EnumDispatchStatus.IAMWEB_ORDER.toString() ? (
              <Button
                variant='contained'
                className='mr-2 font-bold text-black bg-green-500 w-44'
                onClick={() =>
                  onStatusUpdate({
                    order,
                    status: EnumDispatchStatus.DISPATCH_REQUEST,
                    handleModalClose,
                    setReloadList,
                  })
                }
              >
                배차요청
              </Button>
            ) : (
              // 수정모드 - 완료, 배차취소가 아닌것은 배차요청취소
              ""
            )
          }
          {uiType === UIType.MODIFY &&
          order.status !== EnumDispatchStatus.DONE &&
          order.status !== EnumDispatchStatus.DISPATCH_REQUEST_CANCEL &&
          order.status !== EnumDispatchStatus.DISPATCH_CANCEL ? (
            <Button
              variant='contained'
              className='mr-2 font-bold text-black bg-green-500 w-44'
              onClick={() =>
                onStatusUpdate({
                  order,
                  status: EnumDispatchStatus.DISPATCH_REQUEST_CANCEL, // 배차요쳥 취소
                  handleModalClose,
                  setReloadList,
                })
              }
            >
              배차요청 취소
            </Button>
          ) : // 배차요청 취소일 경우 취소한 시간을 보여줌
          order !== undefined ? (
            <>
              {order.else02 === "" ||
              JSON.parse(order.else02)["dispatch_cancel_time"] === undefined
                ? ""
                : `[배차요청취소시간: ${
                    JSON.parse(order.else02)["dispatch_cancel_time"]
                  }]`}
            </>
          ) : (
            ""
          )}
        </div>
      </Typography>
    </>
  );
}

// 상품구분
export function OrderTypeUI({ uiType, order, setSelectType, updateData }: any) {
  return (
    <>
      {" "}
      <div className='flex flex-row items-center w-80'>
        <div
          className={
            `w-24 text-sm ` +
            (updateData !== undefined && updateData.orderTitle !== ""
              ? "text-orange-600 font-bold "
              : "")
          }
        >
          상품구분
        </div>

        {/* 배차입력, 아임웹일 경우는 타이틀만 보여준다. */}
        {uiType === UIType.DISPATCH || order?.isIamweb ? (
          <div className='flex items-center justify-center w-full h-full m-2 rounded-lg bg-slate-300'>
            <div
              className='px-2 text-xs'
              dangerouslySetInnerHTML={{
                __html:
                  `${order!.orderTitle}` +
                  (updateData !== undefined && updateData.orderTitle !== ""
                    ? ` [<b>${updateData.orderTitle}</b>] `
                    : ""),
              }}
            ></div>
          </div>
        ) : (
          <select
            className='w-full m-3 rounded-lg'
            id='orderTitle'
            onChange={(v) => {
              setSelectType(v.target.value);
            }}
          >
            {orderTypeList.map((d, k) => (
              <option
                key={k}
                value={d}
                selected={
                  uiType === UIType.MODIFY && d === order!.orderTitle
                    ? true
                    : false
                }
              >
                {d}
              </option>
            ))}
          </select>
        )}
      </div>
    </>
  );
}

export function DispatchOrderUI({
  uiType,
  order,
  startDate,
  setStartDate,
  iamwebTimeOrderInfo,
  selectType,
  startAddress,
  setIsStartAddressSearchShow,
  goalAddress,
  setIsGoalAddressSearchShow,
  updateData,
  setStartAddress,
  setGoalAddress,
}: any) {
  return (
    <>
      <div className='flex flex-col pb-1 pl-5'>
        {/* 탑승일시 데이터 */}
        {uiType === UIType.DISPATCH ? (
          <InfoBoxWithTitle
            title='탑승일시'
            info={DateUtils.iso8601DateToString(order!.boardingDate)}
            updateData={
              updateData !== undefined && updateData.boardingDate !== ""
                ? DateUtils.iso8601DateToString(updateData?.boardingDate)
                : ""
            }
          />
        ) : (
          <BoardingDateComponent
            startDate={startDate}
            setStartDate={setStartDate}
          />
        )}
        {/* 시간대절에 값이 없을 경우 */}
        {iamwebTimeOrderInfo === undefined ? (
          <>
            {/* 배차정보 - 출발지명 도착지명 */}
            {uiType === UIType.DISPATCH ? (
              <>
                <DispatchStartGoalLocationShowUI
                  order={order}
                  updateData={updateData}
                />
              </>
            ) : (
              <>
                {/* 주문 데이터 출발지명 도착지명수정모드 */}
                <DispatchStartGoalLocationInputUI
                  order={order}
                  selectType={selectType}
                  uiType={uiType}
                  orderTypeList={orderTypeList}
                  startAddress={startAddress}
                  setIsStartAddressSearchShow={setIsStartAddressSearchShow}
                  goalAddress={goalAddress}
                  setIsGoalAddressSearchShow={setIsGoalAddressSearchShow}
                  setStartAddress={setStartAddress}
                  setGoalAddress={setGoalAddress}
                />
              </>
            )}
          </>
        ) : // 시간대절 - 배차정보입력창
        uiType === UIType.DISPATCH ? (
          <>
            <DispatchStartGoalRouteTimezonShowUI
              iamwebTimeOrderInfo={iamwebTimeOrderInfo}
              updateData={updateData}
            />
          </>
        ) : (
          // 시간대절 - 데이터 수정
          <>
            <DispatchStartGoalRouteTimezonInputUI
              iamwebTimeOrderInfo={iamwebTimeOrderInfo}
            />
          </>
        )}

        {/* 2023.06.09 추가 - 탑승자명/탑승자번호 - 아임웹이 아닐 경우 */}
        {order?.isIamweb ? (
          ""
        ) : (
          <>
            {uiType === UIType.DISPATCH ? (
              <>
                <CustomNamePhoneShowUI order={order} updateData={updateData} />
              </>
            ) : (
              <>
                <CustomNamePhoneInputUI uiType={uiType} order={order} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

function SendMessageButton({ title, onClick }: any) {
  return (
    <>
      <Button
        variant='contained'
        className='w-full m-2 text-black bg-green-500 hover:bg-green-900 hover:text-white'
        onClick={onClick}
      >
        {title}
      </Button>
    </>
  );
}

// 문자 전송 텐플릿
const TxtTemplateJson = {
  dispatchComplete: {
    card_after: {
      getCompany: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
예약 배차정보를 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getCustom: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
고객님의 예약을 함께 할 지니(기사)님의 정보를 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getJini: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
후불 예약 배차정보 안내드립니다.
- 운임료는 고객에게 절대! 받으면 안됩니다.!!

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 탑승자 연락처: ${order.customPhone}
▶ 예약금액: ${dispatch.totalFare}
- 추가요금 발생시 지급 가능 / 기타요금 발생시 영수증 제출 필수
▶ 기타:

감사합니다.`,
    },
    direct: {
      getCompany: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
예약 배차정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getCustom: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
고객님의 예약을 함께 할 지니(기사)님의 정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getJini: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
후불 예약 배차정보 안내드립니다.
- 운임료는 고객 탑승 시 "직접결제"로 결제 해주시기 바랍니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 탑승자 연락처: ${order.customPhone}
▶ 예약금액: ${dispatch.totalFare}
- 추가요금 발생시 지급 가능 / 기타요금 발생시 영수증 제출 필수
▶ 기타:

감사합니다.`,
    },
  },
  dispatchInfomationUpdate: {
    card_after: {
      getCompany: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
예약 배차정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getCustom: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
고객님의 예약을 함께 할 지니(기사)님의 정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getJini: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
후불 예약 배차정보가 변경되어 안내드립니다.
- 운임료는 고객에게 절대! 받으면 안됩니다.!!

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 탑승자 연락처: ${order.customPhone}
▶ 예약금액: ${dispatch.totalFare}
- 추가요금 발생시 지급 가능 / 기타요금 발생시 영수증 제출 필수
▶ 기타:

감사합니다.`,
    },
    direct: {
      getCompany: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
예약 배차정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getCustom: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
고객님의 예약을 함께 할 지니(기사)님의 정보가 변경되어 안내드립니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 지니(기사)정보
- 성함: ${dispatch.jiniName}
- 차량번호: ${dispatch.carInfo}
- 연락처: ${dispatch.jiniPhone}

감사합니다.`,
      getJini: (
        order: OrderModel,
        dispatch: DispatchModel
      ) => `안녕하세요 i.M입니다.
현장결제 예약 배차정보가 변경되어 안내드립니다.
- 운임료는 고객 탑승 시 "직접결제"로 결제 해주시기 바랍니다.

▶ 출발일시: ${DateUtils.iso8601DateToStringForMMDDmmss(order.boardingDate)}
▶ 출발지: ${order.startLocation}
▶ 도착지: ${order.goalLocation}
▶ 탑승자 연락처: ${order.customPhone}
▶ 예약금액: ${dispatch.totalFare}
- 추가요금 발생시 지급 가능 / 기타요금 발생시 영수증 제출 필수
▶ 기타:

감사합니다.`,
    },
  },
};
export function SendTxtMessage({ uiType, order, dispatch }: any) {
  const [openTextModal, setOpenTextModal] = useState(false);
  const [txtType, setTxtType] = useState(0);
  const [txt, setTxt] = useState("");
  const [phones, setPhones] = useState("");

  const setModal = (type: number) => {
    setOpenTextModal(true);
    setTxtType(type);

    if (type === 0) {
      setPhones(dispatch.userPhone);
    } else if (type === 1) {
      setPhones(order.customPhone);
    } else if (type === 2) {
      setPhones(dispatch.jiniPhone);
    }
  };

  // 완료처리
  const setDone = () => {
    setOpenTextModal(false);
    setTxt("");
  };

  const sendTxt = () => {
    if (phones!.trim() === "" || txt!.trim() === "") {
      alert("전화번호 및 내용을 입력해주세요");
      return;
    }
    callAPI({
      urlInfo: APIURLs.SEND_TXT,
      params: {
        phones,
        txt,
        orderId: order.id,
        isJini: txtType === 2 ? true : false, // 지니일경우 true
      },
    })
      .then((d) => d.json())
      .then((d) => {
        if (d.ok) {
          alert("문자전송성공");
          setDone();
        } else {
          alert("문자전송 실패 - 관리자에게 문의 " + d);
          setDone();
        }
      });
  };
  return (
    <>
      {uiType === UIType.DISPATCH ? (
        <div className='mt-2'>
          <div className='mt-2 bg-slate-200'>
            <div className='pt-2 text-lg font-bold text-center'>문자전송</div>
            <div className='flex flex-row'>
              <SendMessageButton title={"제휴사"} onClick={() => setModal(0)} />
              {order.isIamweb ? (
                ""
              ) : (
                <SendMessageButton
                  title={"탑승자"}
                  onClick={() => setModal(1)}
                />
              )}
              {/* 지니 버튼은 지니 전화번호가 있을때만 노출 */}
              {dispatch !== undefined &&
              dispatch.jiniPhone !== undefined &&
              dispatch.jiniPhone !== "" ? (
                <>
                  <SendMessageButton
                    title={"지니"}
                    onClick={() => setModal(2)}
                  />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div
            className={
              openTextModal === false
                ? "hidden"
                : `fixed inset-0 items-center justify-center `
            }
          >
            {/* 문자전송 모달 */}
            <div className='w-full h-full p-20 bg-slate-900 bg-opacity-80'>
              <div className='flex flex-row w-4/6 p-16 ml-64 bg-slate-200 rounded-2xl'>
                <div className='flex flex-col items-center mt-10 mr-10'>
                  <h2 className='mb-4 text-xl font-bold '>
                    전송템플릿타입[
                    {txtType === 0
                      ? " 제휴사 "
                      : txtType === 1
                      ? " 탑승자 "
                      : " 지니 "}
                    ]
                  </h2>
                  <div className='w-52'>
                    <SendMessageButton
                      title={"배차완료"}
                      onClick={() => {
                        let data = "";
                        const payType = getSelctOptionValue("payType");
                        if (payType === "카드" || payType === "후불") {
                          if (txtType === 0) {
                            data =
                              TxtTemplateJson.dispatchComplete.card_after.getCompany(
                                order,
                                dispatch
                              );
                          } else if (txtType === 1) {
                            data =
                              TxtTemplateJson.dispatchComplete.card_after.getCustom(
                                order,
                                dispatch
                              );
                          } else if (txtType === 2) {
                            data =
                              TxtTemplateJson.dispatchComplete.card_after.getJini(
                                order,
                                dispatch
                              );
                          }
                        } else if (payType === "직접결제") {
                          if (txtType === 0) {
                            data =
                              TxtTemplateJson.dispatchComplete.direct.getCompany(
                                order,
                                dispatch
                              );
                          } else if (txtType === 1) {
                            data =
                              TxtTemplateJson.dispatchComplete.direct.getCustom(
                                order,
                                dispatch
                              );
                          } else if (txtType === 2) {
                            data =
                              TxtTemplateJson.dispatchComplete.direct.getJini(
                                order,
                                dispatch
                              );
                          }
                        }

                        setTxt(data);
                      }}
                    />
                    <SendMessageButton
                      title={"배차정보수정"}
                      onClick={() => {
                        let data = "";
                        const payType = getSelctOptionValue("payType");
                        if (payType === "카드" || payType === "후불") {
                          if (txtType === 0) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.card_after.getCompany(
                                order,
                                dispatch
                              );
                          } else if (txtType === 1) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.card_after.getCustom(
                                order,
                                dispatch
                              );
                          } else if (txtType === 2) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.card_after.getJini(
                                order,
                                dispatch
                              );
                          }
                        } else if (payType === "직접결제") {
                          if (txtType === 0) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.direct.getCompany(
                                order,
                                dispatch
                              );
                          } else if (txtType === 1) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.direct.getCustom(
                                order,
                                dispatch
                              );
                          } else if (txtType === 2) {
                            data =
                              TxtTemplateJson.dispatchInfomationUpdate.direct.getJini(
                                order,
                                dispatch
                              );
                          }
                        }

                        setTxt(data);
                      }}
                    />
                  </div>
                </div>
                <div className='w-ful'>
                  <div className='relative'>
                    <button
                      className='absolute p-2 mt-4 mr-4 bg-orange-500 rounded-full right-1 top-1 hover:bg-red-600 focus:outline-none'
                      onClick={() => {
                        setDone();
                      }}
                    >
                      <svg
                        className='w-4 h-4 font-bold text-slate-100'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M6 18L18 6M6 6l12 12'
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className='flex items-center justify-center p-3 bg-slate-700'>
                    <div className='h-full p-6 bg-white rounded-lg shadow-lg'>
                      <div className='w-5 h-5 mx-auto mb-4 bg-gray-300 rounded-full'></div>
                      <div className='h-full p-4 overflow-y-auto bg-gray-200 rounded-lg'>
                        <textarea
                          className='p-8 text-sm rounded-xl w-80 h-96'
                          cols={20}
                          rows={10}
                          value={txt}
                          onChange={(e) => {
                            setTxt(e.target.value);
                          }}
                        />
                      </div>
                      <div className='flex mt-4'>
                        <input
                          type='text'
                          className='flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500'
                          defaultValue={phones}
                          onChange={(e) => {
                            setPhones(e.target.value);
                          }}
                        />
                        <button
                          className='px-4 py-2 text-white bg-blue-500 rounded-r-lg hover:bg-blue-600 focus:outline-none'
                          onClick={() => {
                            sendTxt();
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

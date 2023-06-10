import { Button, Card, TextField, Typography } from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { UIType } from "../../../pages/admin/dispatch/manageDispatch";
import "react-datepicker/dist/react-datepicker.css";
import { DispatchUtils, EnumDispatchStatus } from "./dispatch.utils";
import { callAPI } from "../call/call";
import { APIURLs } from "../constants";
import { CompanyModel } from "../models/company.model";
import { getHTMLElementByID, getSelctOptionValue } from "./html.utils";
import { DateUtils } from "@libs/date.utils";

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
      <div className='text-sm'>{info}</div>
    </div>
  );
}
export function InfoBoxWithTitle({ title, info }: any) {
  return (
    <div className='flex flex-row items-center my-1 w-80'>
      <div className='w-24 text-sm'>{title}</div>
      <InfoBox info={info} />
    </div>
  );
}

export const orderTypeList = ["공항픽업", "공항샌딩", "시간대절"];

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
export function MyDaumPostcode({ isDisplay, onComplete }: any) {
  return (
    <DaumPostcode
      style={{
        position: "absolute",
        top: "48%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "650px",
        height: "500px",
        border: "2px solid #000",
        boxShadow: "24",
        display: isDisplay ? "block" : "none",
      }}
      onComplete={onComplete}
    />
  );
}

export function LocationAndAddress({
  title,
  selectType,
  orderType,
  uiType,
  address,
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
            <TextField
              value={address}
              className='w-full text-sm'
              onClick={() => {
                setIsAddressSearchShow(true);
              }}
            />
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
        <div className='text-sm w-28'>전달사항</div>
        <div className='w-full p-2 border-2'>
          {
            // 전달사항 출력처리
            // 아임웹 -> json처리 해야 함
            isIamweb === true && infoDataJson !== undefined ? (
              <>
                {Object.keys(infoDataJson).map((d) => {
                  const url = `http://101.33.73.252:9999/api/airport/view/${infoDataJson[d]}`;
                  return (
                    <div key={d} className='flex flex-row justify-between'>
                      <div className='p-2 m-1 text-sm rounded-lg w-96 bg-slate-200'>
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
                          <div className='w-full p-2 m-1 text-sm bg-white border-2 rounded-lg'>
                            {infoDataJson[d]}
                          </div>
                        ) : (
                          <input
                            id={d}
                            defaultValue={infoDataJson[d]}
                            className='w-full p-2 m-1 text-sm bg-white border-2 rounded-lg'
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
              </>
            ) : // 업체에서 배차요청한 데이터일경우 배차처리시 화면에 출력만 함
            uiType === UIType.DISPATCH ? (
              <>
                <div className='w-full h-full p-3 whitespace-pre rounded-lg'>
                  {infoDataJson}
                </div>
              </>
            ) : (
              <TextField
                id='infomation'
                defaultValue={
                  uiType === UIType.MODIFY
                    ? infoDataJson
                    : "탑승자수:\n수화물수:\n경유지:\n경유지주소:\n국적:\n기타:\n"
                }
                className='w-full text-sm'
                multiline
                placeholder='탑승자수, 수화물수, 경유지, 경유지주소, 국적 정보를 넣어 주세요'
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
            onChange={(date) => setStartDate(date)}
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
          <div className='w-full p-2 border-2 border-dashed rounded-lg'>
            {val}
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
              <DispatchProcessInfo
                title='기본요금'
                id='baseFare'
                value={dispatch ? dispatch.baseFare : 0}
                isNumber={true}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <DispatchProcessInfo
                title='추가요금'
                id='addFare'
                value={dispatch ? dispatch.addFare : 0}
                isNumber={true}
                isModify={isModify}
              />
            </div>
            <div className='flex flex-row'>
              <DispatchProcessInfo
                title='초과요금'
                id='exceedFare'
                value={dispatch ? dispatch.exceedFare : 0}
                isNumber={true}
                isModify={isModify}
              />
              <GapWidthForDispatchInput />
              <DispatchProcessInfo
                title='요금총합'
                id='totalFare'
                value={dispatch ? dispatch.totalFare : 0}
                isNumber={true}
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
                  value='현금'
                  selected={dispatch?.payType === "현금" ? true : false}
                >
                  현금
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
              <TextField
                multiline
                minRows={3}
                maxRows={3}
                defaultValue={dispatch?.memo}
                id='memo'
              />
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
  call,
  handleModalClose,
  setReloadList,
}: any) {
  const dispatchStatus = getSelctOptionValue("dispatchStatus");

  // 배차 완료가 아닐경우는 데이터 확인이 필요 없음
  // if (dispatchStatus !== EnumDispatchStatus.DISPATCH_COMPLETE) {
  onStatusUpdate({
    order,
    status: dispatchStatus,
    handleModalClose,
    setReloadList,
  });
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
  const addFare = _baseFare === "" ? 0 : +_addFare;
  const totalFare = _baseFare === "" ? 0 : +_totalFare;
  const exceedFare = _baseFare === "" ? 0 : +_exceedFare;
  if (
    carCompany === "" ||
    jiniName === "" ||
    carInfo === "" ||
    jiniPhone === ""
  ) {
    setMessage("모든 데이터를 입력해주세요");
  } else {
    call({
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
      orderId: dispatch ? dispatch.orderId : order!.id,
      dispatchStatus: dispatchStatus === order!.status ? "" : dispatchStatus,

      // 2023.06.09 추가
      carType,
      payType,
      memo,
      exceedFare,
    });
    // }
  }
}

// 배차처리에 출발지명, 출발지주소, 도착지, 도착지 주소 출력
export function DispatchStartGoalLocationShowUI({ order }: any) {
  return (
    <>
      <InfoBoxWithTitle title='출발지명' info={order?.startLocation} />
      <InfoBoxWithTitle title='출발지주소' info={order?.startAddress} />
      <InfoBoxWithTitle title='도착지' info={order?.goalLocation} />
      <InfoBoxWithTitle title='도착지주소' info={order?.goalAddress} />
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
}: any) {
  return (
    <>
      <LocationAndAddress
        title={"출발지"}
        selectType={selectType}
        orderType={orderTypeList[0]}
        uiType={uiType}
        address={startAddress}
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
export function CustomNamePhoneShowUI({ order }: any) {
  return (
    <>
      <InfoBoxWithTitle title='탑승자이름' info={order?.customName} />
      <InfoBoxWithTitle title='탑승자번호' info={order?.customPhone} />
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
              ""
            )
          }
        </div>
      </Typography>
    </>
  );
}

// 상품구분
export function OrderTypeUI({ uiType, order, setSelectType }: any) {
  return (
    <>
      {" "}
      <div className='flex flex-row items-center w-80'>
        <div className='w-24 text-sm'>상품구분</div>

        {/* 배차입력, 아임웹일 경우는 타이틀만 보여준다. */}
        {uiType === UIType.DISPATCH || order?.isIamweb ? (
          <div className='flex items-center justify-center w-full h-full m-2 rounded-lg bg-slate-300'>
            <div className='px-2 text-xs'>{order!.orderTitle}</div>
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
}: any) {
  return (
    <>
      <div className='flex flex-col pb-1 pl-5'>
        {/* 탑승일시 데이터 */}
        {uiType === UIType.DISPATCH ? (
          <InfoBoxWithTitle
            title='탑승일시'
            info={DateUtils.iso8601DateToString(order!.boardingDate)}
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
                <DispatchStartGoalLocationShowUI order={order} />
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
                />
              </>
            )}
          </>
        ) : // 시간대절 - 배차정보입력창
        uiType === UIType.DISPATCH ? (
          <>
            <DispatchStartGoalRouteTimezonShowUI
              iamwebTimeOrderInfo={iamwebTimeOrderInfo}
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
                <CustomNamePhoneShowUI order={order} />
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

import {
  Backdrop,
  Box,
  Button,
  Card,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useCallAPI from "../../../libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "../../../libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import {
  getHTMLElementByID,
  getSelctOptionValue,
} from "../../../libs/client/utils/html.utils";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { OrderModel } from "@libs/client/models/order.model";
import { UserModel } from "@libs/client/models/user.model";

import {
  BoardingDateComponent,
  DispatchProcessInfo,
  GapWidthForDispatchInput,
  IamWebTimeOrderInputBox,
  InfoBoxWithTitle,
  InfomationComponent,
  LocationAndAddress,
  MyDaumPostcode,
  SelectBoxStatusList,
  UserInfomation,
  orderTypeList,
} from "@libs/client/utils/dispatch.ui.utils";
import {
  DispatchUtils,
  EnumDispatchStatus,
} from "@libs/client/utils/dispatch.utils";
import { DispatchModel } from "@libs/client/models/dispatch.model";
import { DateUtils } from "@libs/date.utils";
import { ElseUtils } from "@libs/client/utils/else.utils";

export enum UIType {
  CREATE,
  MODIFY,
  DISPATCH,
}

interface ModalProps {
  uiType: UIType;
  order?: OrderModel;
  open: boolean;
  handleModalClose: Function;
  setReloadList: Function;
}

export default function ManageDispatchModal({
  open,
  order,
  handleModalClose,
  uiType,
  setReloadList,
}: ModalProps) {
  // 처음 실행 체크
  const [isFirst, setIsFirst] = useState(true);

  // 배차정보 모델
  const [dispatch, setDispatch] = useState<DispatchModel>();

  // 데이터 저장 Hook
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url:
      open && uiType === UIType.MODIFY
        ? APIURLs.ORDER_UPDATE
        : open && uiType === UIType.CREATE
        ? APIURLs.ORDER_CREATE
        : dispatch === undefined || dispatch == null
        ? APIURLs.DISPATCH_CREATE
        : APIURLs.DISPATCH_UPDATE,
    addUrlParams:
      open && uiType === UIType.MODIFY
        ? `/${order!.id}`
        : open && uiType === UIType.DISPATCH && dispatch
        ? `/${dispatch!.id}`
        : "",
  });

  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const [selectType, setSelectType] = useState(orderTypeList[0]);

  const [me, setMe] = useState<UserModel>();
  const [isModify, setIsModify] = useState(true);

  // 주문 - 전달사항 데이터
  const [informationForOrder, setInformationForOrder] = useState("");

  const [iamwebTimeOrderInfo, setIamwebTimeOrderInfo] = useState(undefined);
  // 주소관련
  const [isStartAddressSearchShow, setIsStartAddressSearchShow] =
    useState(false);
  const [isGoalAddressSearchShow, setIsGoalAddressSearchShow] = useState(false);
  const [startAddress, setStartAddress] = useState("");
  const [goalAddress, setGoalAddress] = useState("");

  useEffect(() => {
    if (!loading && !isFirst) {
      if (data?.ok === false) {
        setMessage(data?.data.description.codeMessage);
      } else if (data?.ok === true) {
        handleModalClose(true);
        setReloadList(Date.now() * 1);
      }
    }
    if (isFirst) {
      setIsFirst(false);
    }
  }, [loading]);

  // 사용자 정보를 조회해서 화면에 세팅하기
  const getOrderUserInfo = () => {
    const user = callAPI({
      urlInfo: APIURLs.USER_BY_ID,
      addUrlParams: `/${order?.userId}`,
    }).then((d) => d.json());
    user.then((d) => {
      setMe(d.data);
      setStartDate(new Date(order!.boardingDate));
      setSelectType(order!.orderTitle);
      setStartAddress(order!.startAddress);
      setGoalAddress(order!.goalAddress);
    });
  };

  const getAddress = (
    nowType: string,
    compareType: string,
    idValue: string,
    addressDAta: string
  ) => {
    let location;
    let address;
    if (nowType === compareType) {
      const locationObj = getHTMLElementByID<HTMLSelectElement>(idValue);
      location = locationObj.options[locationObj.selectedIndex].value;
      address = nowType;
    } else {
      location = getHTMLElementByID<HTMLInputElement>(idValue).value;
      address = addressDAta;
    }
    return { location, address };
  };

  // 모달창이 열릴때 세팅하기
  useEffect(() => {
    if (open === false) return;
    // 주문 정보 수정모드
    if (uiType === UIType.MODIFY) {
      getOrderUserInfo();
    }

    // 배차관련 정보
    if (uiType === UIType.DISPATCH) {
      getOrderUserInfo();

      // 주문아이디로 배차정보 조회하기
      callAPI({
        urlInfo: APIURLs.DISPATCH_GET_BY_ORDERID,
        addUrlParams: `/${order?.id}`,
      })
        .then((d) => d.json())
        .then((d) => setDispatch(d.data));
    }

    // 생성 - 내 정보만 조회함
    // const me = callAPI({ urlInfo: APIURLs.ME }).then((d) => d.json());
    const me = ElseUtils.getUserFromLocalStorage();
    //me.then((d) => setMe(d.data));
    setMe(me);
    setIsModify(me.role !== "USER");

    // 시간대절데이터가 있는지 확인
    const else01 = order?.else01;
    let else01Json = undefined;
    if (else01 !== undefined && else01 !== "") {
      else01Json = JSON.parse(else01);

      // 시간대절데이터 json 형태로 저장
      setIamwebTimeOrderInfo(else01Json);
    }
  }, [open]);

  useEffect(() => {
    if (order === undefined) return;
    setInformationForOrder(order!.information);
  }, [order]);

  // 배차정보 입력 저장
  const onSubmitDispatch = () => {
    const dispatchStatus = getSelctOptionValue("dispatchStatus");

    // 배차 완료가 아닐경우는 데이터 확인이 필요 없음
    // if (dispatchStatus !== EnumDispatchStatus.DISPATCH_COMPLETE) {
    onStatusUpdate(dispatchStatus);
    // } else {
    const carCompany = getHTMLElementByID<HTMLInputElement>("carCompany").value;
    const jiniName = getHTMLElementByID<HTMLInputElement>("jiniName").value;
    const carInfo = getHTMLElementByID<HTMLInputElement>("carInfo").value;
    const jiniPhone = getHTMLElementByID<HTMLInputElement>("jiniPhone").value;
    const _baseFare = getHTMLElementByID<HTMLInputElement>("baseFare").value;
    const _addFare = getHTMLElementByID<HTMLInputElement>("addFare").value;
    const _totalFare = getHTMLElementByID<HTMLInputElement>("totalFare").value;

    // 2023.06.09 추가
    const _exceedFare =
      getHTMLElementByID<HTMLInputElement>("exceedFare").value;
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
  };

  // 배차신청 수정, 생성 처리
  const onSubmit = () => {
    let orderTitle;
    let else01Json = order?.else01;

    // 2023.06.09 추가 탑승자,탑승자전번
    let customName = "";
    let customPhone = "";

    // 아임웹일 경우
    if (order?.isIamweb) {
      orderTitle = order.orderTitle;

      // 시간대절상품
      if (else01Json !== "") {
        // 시간대절 데이터
        const startGoal =
          getHTMLElementByID<HTMLInputElement>("start_goal").value;
        const tripRoute =
          getHTMLElementByID<HTMLInputElement>("trip_route").value;
        const timezon = getHTMLElementByID<HTMLInputElement>("timezon").value;
        else01Json = `{"start_goal":"${startGoal}" , "trip_route":"${tripRoute}" , "timezon":"${timezon}"}`;
      }
    }
    // 시간대절이 아닐경우 선택박스에서 상품명을 가져온다.
    else {
      const titleObj = getHTMLElementByID<HTMLSelectElement>("orderTitle");
      orderTitle = titleObj.options[titleObj.selectedIndex].value;

      // 2023.06.09 추가 (탑승자, 탑승자전번)
      customName = getHTMLElementByID<HTMLInputElement>("customName").value;
      customPhone = getHTMLElementByID<HTMLInputElement>("customPhone").value;
    }

    const boardingDate = startDate;
    let information = informationForOrder; // getHTMLElementByID<HTMLInputElement>("infomation").value;

    let startInfo;
    let goalInfo;

    // 시간대절 주문이 아닐경우
    if (else01Json === "" || else01Json === undefined) {
      startInfo = getAddress(
        selectType,
        orderTypeList[0],
        "startLocation",
        startAddress
      );
      goalInfo = getAddress(
        selectType,
        orderTypeList[1],
        "goalLocation",
        goalAddress
      );

      if (
        orderTitle === "" ||
        boardingDate === null ||
        startInfo.location === "" ||
        goalInfo.location === "" ||
        startInfo.address === "" ||
        goalInfo.address === "" ||
        information === ""
      ) {
        setMessage("모든 데이터를 입력해주세요");
      } else {
        call({
          orderTitle,
          boardingDate,
          startLocation: startInfo.location,
          startAddress: startInfo.address,
          goalLocation: goalInfo.location,
          goalAddress: goalInfo.address,
          information,
          else01: "",
          else02: "",

          // 2023.06.09 추가
          customName,
          customPhone,
        });
      }
    } else {
      if (orderTitle === "" || boardingDate === null || information === "") {
        setMessage("모든 데이터를 입력해주세요");
      } else {
        call({
          orderTitle,
          boardingDate,
          information,
          else01: else01Json,
          else02: "",

          // 2023.06.09 추가
          customName,
          customPhone,
        });
      }
    }
  };

  // 상태값 변경
  const onStatusUpdate = (status: string) => {
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
  };

  const closeAddressModal = () => {
    setIsStartAddressSearchShow(false);
    setIsGoalAddressSearchShow(false);
  };

  const onStartAddress = (data: any) => {
    closeAddressModal();
    setStartAddress(data.address);
  };

  const onGoalAddress = (data: any) => {
    closeAddressModal();
    setGoalAddress(data.address);
  };

  // 스타일 정의 code

  return (
    <>
      {open && (
        <Modal
          className='bg-gray-700 bg-opacity-80'
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          open={open}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className=''>
              <Box sx={style} className='bg-slate-100'>
                <Typography
                  id='transition-modal-title'
                  variant='h6'
                  component='h2'
                >
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
                      order.status ===
                        EnumDispatchStatus.IAMWEB_ORDER.toString() ? (
                        <Button
                          variant='contained'
                          className='mr-2 font-bold text-black bg-green-500 w-44'
                          onClick={() =>
                            onStatusUpdate(EnumDispatchStatus.DISPATCH_REQUEST)
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
                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack className='flex flex-row'>
                    <Card className='p-6 rounded-lg'>
                      <div className='flex flex-row'>
                        <div className='flex flex-col p-3'>
                          <div className='flex flex-row items-center w-80'>
                            <div className='w-24 text-sm'>상품구분</div>

                            {/* 배차입력, 아임웹일 경우는 타이틀만 보여준다. */}
                            {uiType === UIType.DISPATCH || order?.isIamweb ? (
                              <div className='flex items-center justify-center w-full h-full m-2 rounded-lg bg-slate-300'>
                                <div className='px-2 text-xs'>
                                  {order!.orderTitle}
                                </div>
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
                                      uiType === UIType.MODIFY &&
                                      d === order!.orderTitle
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
                          <UserInfomation me={me} />
                        </div>
                        <div className='flex flex-col pl-5'>
                          {/* 탑승일시 데이터 */}
                          {uiType === UIType.DISPATCH ? (
                            <InfoBoxWithTitle
                              title='탑승일시'
                              info={DateUtils.iso8601DateToString(
                                order!.boardingDate
                              )}
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
                                  <InfoBoxWithTitle
                                    title='출발지명'
                                    info={order?.startLocation}
                                  />
                                  <InfoBoxWithTitle
                                    title='출발지주소'
                                    info={order?.startAddress}
                                  />
                                  <InfoBoxWithTitle
                                    title='도착지'
                                    info={order?.goalLocation}
                                  />
                                  <InfoBoxWithTitle
                                    title='도착지주소'
                                    info={order?.goalAddress}
                                  />
                                </>
                              ) : (
                                <>
                                  {/* 주문 데이터 출발지명 도착지명수정모드 */}
                                  <LocationAndAddress
                                    title={"출발지"}
                                    selectType={selectType}
                                    orderType={orderTypeList[0]}
                                    uiType={uiType}
                                    address={startAddress}
                                    setIsAddressSearchShow={
                                      setIsStartAddressSearchShow
                                    }
                                    locationStr={"startLocation"}
                                    locationObj={order?.startLocation}
                                  />
                                  <LocationAndAddress
                                    title={"도착지"}
                                    selectType={selectType}
                                    orderType={orderTypeList[1]}
                                    uiType={uiType}
                                    address={goalAddress}
                                    setIsAddressSearchShow={
                                      setIsGoalAddressSearchShow
                                    }
                                    locationStr={"goalLocation"}
                                    locationObj={order?.goalLocation}
                                  />
                                </>
                              )}
                            </>
                          ) : // 시간대절 - 배차정보입력창
                          uiType === UIType.DISPATCH ? (
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
                          ) : (
                            // 시간대절 - 데이터 수정
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
                          )}

                          {/* 2023.06.09 추가 - 탑승자명/탑승자번호 - 아임웹이 아닐 경우 */}
                          {order?.isIamweb ? (
                            ""
                          ) : (
                            <>
                              {uiType === UIType.DISPATCH ? (
                                <>
                                  <InfoBoxWithTitle
                                    title='탑승자이름'
                                    info={order?.customName}
                                  />
                                  <InfoBoxWithTitle
                                    title='탑승자번호'
                                    info={order?.customPhone}
                                  />
                                </>
                              ) : (
                                <>
                                  <div className='flex flex-row items-center w-96'>
                                    <div className='text-sm w-28'>탑승자명</div>
                                    <div className='w-full m-1'>
                                      <TextField
                                        id='customName'
                                        defaultValue={
                                          uiType === UIType.MODIFY
                                            ? order?.customName
                                            : ""
                                        }
                                        className='w-full'
                                      />
                                    </div>
                                  </div>
                                  <div className='flex flex-row items-center w-96'>
                                    <div className='text-sm w-28'>
                                      탑승자번호
                                    </div>
                                    <div className='w-full m-1'>
                                      <TextField
                                        id='customPhone'
                                        defaultValue={
                                          uiType === UIType.MODIFY
                                            ? order?.customPhone
                                            : ""
                                        }
                                        className='w-full'
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* 전달사항 정보 세팅 */}
                      <InfomationComponent
                        uiType={uiType}
                        information={informationForOrder}
                        isIamweb={order?.isIamweb}
                        setInformation={setInformationForOrder}
                      />
                    </Card>
                    {uiType === UIType.DISPATCH ? (
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
                                  selected={
                                    dispatch?.carType === "블랙" ? true : false
                                  }
                                >
                                  블랙
                                </option>
                                <option
                                  value='화이트'
                                  selected={
                                    dispatch?.carType === "화이트"
                                      ? true
                                      : false
                                  }
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
                              <select
                                className='w-full my-3 rounded-lg'
                                id='payType'
                              >
                                <option
                                  value='카드'
                                  selected={
                                    dispatch?.payType === "카드" ? true : false
                                  }
                                >
                                  카드
                                </option>
                                <option
                                  value='현금'
                                  selected={
                                    dispatch?.payType === "현금" ? true : false
                                  }
                                >
                                  현금
                                </option>
                                <option
                                  value='후불'
                                  selected={
                                    dispatch?.payType === "후불" ? true : false
                                  }
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
                    ) : (
                      ""
                    )}
                  </Stack>
                  <div
                    className={
                      message === ""
                        ? "hidden "
                        : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 "
                    }
                  >
                    {message}
                  </div>
                  {uiType !== UIType.DISPATCH ? (
                    <>
                      <div className='flex justify-end px-4 mt-2'>
                        <Button
                          variant='contained'
                          className='w-full mr-2 bg-gray-700'
                          onClick={() => {
                            setMessage("");
                            handleModalClose();
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          variant='contained'
                          className='w-full bg-gray-700'
                          onClick={() => {
                            onSubmit();
                          }}
                        >
                          저장
                        </Button>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <MyDaumPostcode
                    isDisplay={isStartAddressSearchShow}
                    onComplete={onStartAddress}
                  />
                  <MyDaumPostcode
                    isDisplay={isGoalAddressSearchShow}
                    onComplete={onGoalAddress}
                  />
                </div>
              </Box>
            </div>
          </Fade>
        </Modal>
      )}
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

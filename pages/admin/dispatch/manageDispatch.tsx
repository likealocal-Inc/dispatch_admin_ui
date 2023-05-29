import {
  Backdrop,
  Box,
  Button,
  Card,
  Fade,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import useCallAPI from "../../../libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "../../../libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import {
  getHTMLElementByID,
  getSelctOptionValue,
} from "../../../libs/client/utils/html";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { OrderModel } from "@libs/client/models/order.model";
import { UserModel } from "@libs/client/models/user.model";

import {
  BoardingDateComponent,
  DispatchProcessInfo,
  InfoBoxWithTitle,
  InfomationComponent,
  LocationAndAddress,
  MyDaumPostcode,
  UserInfomation,
  orderTypeList,
} from "@libs/client/utils/dispatch.ui.utils";
import {
  DispatchUtils,
  EnumDispatchStatus,
} from "@libs/client/utils/dispatch.utils";
import { DispatchModel } from "@libs/client/models/dispatch.model";
import { DateUtils } from "@libs/date.utils";

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
}

export default function ManageDispatchModal({
  open,
  order,
  handleModalClose,
  uiType,
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
        : dispatch
        ? APIURLs.DISPATCH_UPDATE
        : APIURLs.DISPATCH_CREATE,
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
        location.reload();
      }
    }
    if (isFirst) {
      setIsFirst(false);
    }
  }, [loading]);

  // 사용자 정보를 조회해서 화면에 세팅하기
  const getUserInfo = () => {
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

  useEffect(() => {
    // 주문 정보 수정모드
    if (uiType === UIType.MODIFY) {
      getUserInfo();
    }
    // 배차관련 정보
    if (uiType === UIType.DISPATCH) {
      getUserInfo();
      callAPI({
        urlInfo: APIURLs.DISPATCH_GET_BY_ORDERID,
        addUrlParams: `/${order?.id}`,
      })
        .then((d) => d.json())
        .then((d) => setDispatch(d.data));
    }
    // 생성 - 내 정보만 조회함
    else {
      const me = callAPI({ urlInfo: APIURLs.ME }).then((d) => d.json());
      me.then((d) => setMe(d.data));
    }
  }, [open]);

  const onSubmitDispatch = () => {
    const carCompany = getHTMLElementByID<HTMLInputElement>("carCompany").value;
    const jiniName = getHTMLElementByID<HTMLInputElement>("jiniName").value;
    const carInfo = getHTMLElementByID<HTMLInputElement>("carInfo").value;
    const jiniPhone = getHTMLElementByID<HTMLInputElement>("jiniPhone").value;
    const _baseFare = getHTMLElementByID<HTMLInputElement>("baseFare").value;
    const _addFare = getHTMLElementByID<HTMLInputElement>("addFare").value;
    const _totalFare = getHTMLElementByID<HTMLInputElement>("totalFare").value;

    const dispatchStatus = getSelctOptionValue("dispatchStatus");

    const baseFare = _baseFare === "" ? 0 : +_baseFare;
    const addFare = _baseFare === "" ? 0 : +_addFare;
    const totalFare = _baseFare === "" ? 0 : +_totalFare;
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
      });
    }
  };

  // 수정, 생성 처리
  const onSubmit = () => {
    let orderTitle;
    if (order?.isIamweb) {
      orderTitle = order.orderTitle;
    } else {
      const titleObj = getHTMLElementByID<HTMLSelectElement>("orderTitle");
      orderTitle = titleObj.options[titleObj.selectedIndex].value;
    }

    const boardingDate = startDate;

    const startInfo = getAddress(
      selectType,
      orderTypeList[0],
      "startLocation",
      startAddress
    );
    const goalInfo = getAddress(
      selectType,
      orderTypeList[1],
      "goalLocation",
      goalAddress
    );

    let information = getHTMLElementByID<HTMLInputElement>("infomation").value;

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
      });
    }
  };

  // 상태값 변경
  const onStatusUpdate = () => {
    callAPI({
      urlInfo: APIURLs.ORDER_STATUS_UPDATE,
      addUrlParams: `/${order!.id}`,
    })
      .then((d) => d.json())
      .then((d) => {
        if (d.ok === true) {
          location.reload();
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
                          onClick={onStatusUpdate}
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
                    <Card className='p-6'>
                      <div className='flex flex-row'>
                        <div className='flex flex-col p-3'>
                          <div className='flex flex-row items-center w-72'>
                            <div className='text-sm w-28'>상품구분</div>
                            {uiType === UIType.DISPATCH || order?.isIamweb ? (
                              <div className='flex items-center justify-center w-full h-full m-2 rounded-lg bg-slate-300'>
                                <div className='px-2 text-xs'>
                                  {order!.orderTitle}{" "}
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
                          {uiType === UIType.DISPATCH ? (
                            <>
                              <InfoBoxWithTitle
                                title='출발지'
                                info={order?.startLocation}
                              />
                              <InfoBoxWithTitle
                                title='출발지주소'
                                info={order?.startAddress}
                              />
                            </>
                          ) : (
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
                          )}
                          {uiType === UIType.DISPATCH ? (
                            <>
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
                          )}
                        </div>
                      </div>
                      <InfomationComponent
                        uiType={uiType}
                        information={order?.information}
                        isIamweb={order?.isIamweb}
                      />
                    </Card>
                    {uiType === UIType.DISPATCH ? (
                      <Card className='p-6 w-[450px]'>
                        <div className='flex flex-row'>
                          <div className='flex flex-col p-3'>
                            <DispatchProcessInfo
                              title='운수사'
                              id='carCompany'
                              value={dispatch ? dispatch.carCompany : ""}
                            />
                            <DispatchProcessInfo
                              title='지니명'
                              id='jiniName'
                              value={dispatch ? dispatch.jiniName : ""}
                            />
                            <DispatchProcessInfo
                              title='차량정보'
                              id='carInfo'
                              value={dispatch ? dispatch.carInfo : ""}
                            />
                            <DispatchProcessInfo
                              title='연락처'
                              id='jiniPhone'
                              value={dispatch ? dispatch.jiniPhone : ""}
                            />
                            <DispatchProcessInfo
                              title='기본요금'
                              id='baseFare'
                              value={dispatch ? dispatch.baseFare : 0}
                              isNumber={true}
                            />
                            <DispatchProcessInfo
                              title='추가요금'
                              id='addFare'
                              value={dispatch ? dispatch.addFare : 0}
                              isNumber={true}
                            />
                            <DispatchProcessInfo
                              title='요금총합'
                              id='totalFare'
                              value={dispatch ? dispatch.totalFare : 0}
                              isNumber={true}
                            />
                            <div className='flex flex-row items-center w-72'>
                              <div className='w-28'>상태값</div>
                              <select
                                className='w-full m-3 rounded-lg'
                                id='dispatchStatus'
                              >
                                {DispatchUtils.statusList.map((d, k) => {
                                  return (
                                    <option
                                      key={k}
                                      value={d}
                                      selected={
                                        order?.status === d ? true : false
                                      }
                                    >
                                      {DispatchUtils.status.get(d)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className=''>
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
                                onSubmitDispatch();
                              }}
                            >
                              저장
                            </Button>
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

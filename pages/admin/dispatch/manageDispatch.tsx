import { Backdrop, Box, Button, Card, Fade, Modal, Stack } from "@mui/material";
import useCallAPI from "@libs/client/hooks/useCallAPI";
import { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { getHTMLElementByID } from "@libs/client/utils/html.utils";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { OrderModel } from "@libs/client/models/order.model";
import { UserModel } from "@libs/client/models/user.model";

import {
  DispatchInfoInput,
  DispatchOrderUI,
  HeaderUI,
  InfomationComponent,
  MyDaumPostcode,
  OrderTypeUI,
  SendTxtMessage,
  UIType,
  UserInfomation,
  onSubmitDispatch,
  orderTypeList,
} from "@libs/client/utils/dispatch.ui.utils";
import { DispatchModel } from "@libs/client/models/dispatch.model";
import { ElseUtils } from "@libs/client/utils/else.utils";

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
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectType, setSelectType] = useState(orderTypeList[0]);
  const [me, setMe] = useState<UserModel>();

  // 배차 요청자
  const [writer, setWriter] = useState<UserModel>();

  const [isModify, setIsModify] = useState(true);
  // 배차정보 모델
  const [dispatch, setDispatch] = useState<DispatchModel>();
  // 데이터 저장 Hook
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url:
      open && uiType === UIType.MODIFY
        ? APIURLs.ORDER_UPDATE
        : // : open && uiType === UIType.CREATE
          APIURLs.ORDER_CREATE,
    // : dispatch === undefined || dispatch!.noData === true // 데이터가 없으면 생성
    // ? APIURLs.DISPATCH_CREATE
    // : APIURLs.DISPATCH_UPDATE,
    addUrlParams: open && uiType === UIType.MODIFY ? `/${order!.id}` : "",
    // : open && uiType === UIType.DISPATCH && dispatch
    // ? `/${dispatch!.id}`
    // "",
  });
  // 주문 - 전달사항 데이터
  const [informationForOrder, setInformationForOrder] = useState("");
  const [iamwebTimeOrderInfo, setIamwebTimeOrderInfo] = useState(undefined);
  // 주소관련
  const [isStartAddressSearchShow, setIsStartAddressSearchShow] =
    useState(false);
  const [isGoalAddressSearchShow, setIsGoalAddressSearchShow] = useState(false);
  const [startAddress, setStartAddress] = useState("");
  const [goalAddress, setGoalAddress] = useState("");

  const [updateData, setUpdateData] = useState(undefined);

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
      setWriter(d.data);
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

    // 업데이트된 데이터 세팅
    if (order?.else02 !== undefined && order?.else02 !== "") {
      const else02Json = JSON.parse(order.else02);
      const else02Keys = Object.keys(else02Json);
      let isUpdate = false;
      for (let index = 0; index < else02Keys.length; index++) {
        const key = else02Keys[index];
        if (key === "update") isUpdate = true;
      }

      if (isUpdate) {
        const updateJson = JSON.parse(else02Json["update"]);
        setUpdateData(updateJson);
      }
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

    let boardingDate2 = startDate;
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
        boardingDate2 === null ||
        startInfo.location === "" ||
        goalInfo.location === "" ||
        startInfo.address === "" ||
        goalInfo.address === "" ||
        information === ""
      ) {
        setMessage("모든 데이터를 입력해주세요");
      } else {
        let date = new Date(boardingDate2);
        let formattedDate = date.toISOString().split("T")[0];
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let formattedTime =
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes;
        const boardingDate = `${formattedDate} ${formattedTime}`;
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
    }
    // 시간대절 상품일경우
    else {
      if (orderTitle === "" || boardingDate2 === null || information === "") {
        setMessage("모든 데이터를 입력해주세요");
      } else {
        let date = new Date(boardingDate2);
        let formattedDate = date.toISOString().split("T")[0];
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let formattedTime =
          (hours < 10 ? "0" : "") +
          hours +
          ":" +
          (minutes < 10 ? "0" : "") +
          minutes;
        const boardingDate = `${formattedDate} ${formattedTime}`;
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

  const closeAddressModal = () => {
    setIsStartAddressSearchShow(false);
    setIsGoalAddressSearchShow(false);
  };

  const onStartAddress = (data: any) => {
    // closeAddressModal();
    setStartAddress(data.address);
  };

  const onGoalAddress = (data: any) => {
    // closeAddressModal();
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
            <div className='z-0'>
              <Box sx={style} className='bg-slate-100'>
                <HeaderUI
                  uiType={uiType}
                  order={order}
                  closeAddressModal={closeAddressModal}
                  setReloadList={setReloadList}
                  handleModalClose={handleModalClose}
                />

                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack className='flex flex-row'>
                    <Card className='p-6 rounded-lg'>
                      <div className='flex flex-row'>
                        <div className='flex flex-col p-3'>
                          <OrderTypeUI
                            uiType={uiType}
                            order={order}
                            setSelectType={setSelectType}
                            updateData={updateData}
                          />
                          {uiType === UIType.DISPATCH ? (
                            <UserInfomation me={writer} />
                          ) : uiType === UIType.MODIFY ? (
                            <UserInfomation me={writer} />
                          ) : (
                            <UserInfomation me={me} />
                          )}
                        </div>

                        {/* 배차 주문 정보  */}
                        <DispatchOrderUI
                          uiType={uiType}
                          order={order}
                          startDate={startDate}
                          setStartDate={setStartDate}
                          iamwebTimeOrderInfo={iamwebTimeOrderInfo}
                          selectType={selectType}
                          startAddress={startAddress}
                          setStartAddress={setStartAddress}
                          setGoalAddress={setGoalAddress}
                          setIsStartAddressSearchShow={
                            setIsStartAddressSearchShow
                          }
                          goalAddress={goalAddress}
                          setIsGoalAddressSearchShow={
                            setIsGoalAddressSearchShow
                          }
                          updateData={updateData}
                        />
                      </div>

                      {/* 전달사항 정보 세팅 */}
                      <InfomationComponent
                        uiType={uiType}
                        information={informationForOrder}
                        isIamweb={order?.isIamweb}
                        setInformation={setInformationForOrder}
                        updateData={updateData}
                      />

                      {/* 문자전송 버튼 */}
                      {me?.role !== "USER" ? (
                        <>
                          <SendTxtMessage
                            uiType={uiType}
                            order={order}
                            dispatch={dispatch}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </Card>
                    {uiType === UIType.DISPATCH ? (
                      // 배차정보 입력
                      <DispatchInfoInput
                        dispatch={dispatch}
                        order={order}
                        isModify={isModify}
                        setMessage={setMessage}
                        handleModalClose={handleModalClose}
                        onSubmitDispatch={() =>
                          onSubmitDispatch({
                            dispatch,
                            order,
                            setMessage,
                            handleModalClose,
                            setReloadList,
                          })
                        }
                      />
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
                    onClose={closeAddressModal}
                  />
                  <MyDaumPostcode
                    isDisplay={isGoalAddressSearchShow}
                    onComplete={onGoalAddress}
                    onClose={closeAddressModal}
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

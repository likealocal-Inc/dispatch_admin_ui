import { useEffect, useState } from "react";
import { Button } from "@mui/material";

import { APIURLs } from "@libs/client/constants";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { MessageProps } from "@components/MessageShow/show";
import TableTemplate from "@components/ListTable/TableTemplate";
import { DateUtils } from "@libs/date.utils";
import {
  DispatchUtils,
  EnumDispatchStatus,
} from "@libs/client/utils/dispatch.utils";
import { OrderModel } from "@libs/client/models/order.model";
import AdminLayout from "@components/layouts/AdminLayout";
import { UserModel } from "@libs/client/models/user.model";
import { ElseUtils } from "@libs/client/utils/else.utils";
import { UIType } from "@libs/client/utils/dispatch.ui.utils";
import ManageDispatchModal from "./manageDispatch";

export default function Orders() {
  const [reloadList, setReloadList] = useState(0);
  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();

  // 화면 재로딩
  const [reload, setReload] = useState(0);

  const [uiType, setUiType] = useState<UIType>(UIType.CREATE);

  const [selectOrder, setSelectOrder] = useState<OrderModel>();

  // 현재 로그인된 사용자
  const [user, setUser] = useState<UserModel>();

  // 모달 관련 설정
  const [openModal, setOpenModal] = useState<boolean>(false);

  // 기본 세팅
  useEffect(() => {
    setTimeout(() => {
      const cacheUser = ElseUtils.getUserFromLocalStorage();
      setUser(cacheUser);
    }, 100);
  }, []);

  const handleModalClose = (isChange: boolean = false) => {
    setOpenModal(false);
    if (isChange) setReload(reload + 1);
  };

  const onCreateOpen = () => {
    setUiType(UIType.CREATE);
    setOpenModal(true);
  };
  const onModifyOpen = (order: OrderModel) => {
    setUiType(UIType.MODIFY);
    setOpenModal(true);
    setSelectOrder(order);
  };

  const onModifyDispatch = (order: OrderModel) => {
    setUiType(UIType.DISPATCH);
    setOpenModal(true);
    setSelectOrder(order);
  };

  const headers = [
    "배차상태",
    "주문ID",
    "주문일시",
    "주문상품",
    "소속/이름/직급",
    "연락처",
    "이메일",
    "탑승일시",
    "탑승자명(연락처)",
    "출발지 위치명",
    "도착지 위치명",
    user?.role !== "USER" ? "배차처리" : "배차내용",
  ];

  const headerWidths = [10, 10, 7, 10, 12, 5, 10, 7, 5, 10, 10, 10];

  const body = (res: OrderModel[]) => {
    return (
      res &&
      res.map((d, key) => {
        const else01 = d.else01;
        let else01Json = undefined;
        if (else01 !== "") {
          else01Json = JSON.parse(else01);
        }
        return (
          <StyledTableRow
            key={key}
            className={`transition duration-300 ease-in-out border-b hover:bg-gray-300`}
          >
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center font-bold text-red-600'>
                <div className='flex justify-center'>
                  {user?.role === "ADMIN" ? (
                    <div className='w-full'>
                      {DispatchUtils.getStatusString(d.status)}
                    </div>
                  ) : (
                    <button
                      onClick={() => onModifyOpen(d)}
                      type='button'
                      className={
                        `inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight rounded shadow-md  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out w-full ` +
                        (d.status === EnumDispatchStatus.DISPATCH_MODIFIED
                          ? " bg-orange-600 hover:bg-orange-700"
                          : " bg-gray-600 hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 active:bg-gray-800")
                      }
                    >
                      {DispatchUtils.getStatusString(d.status)}
                    </button>
                  )}
                </div>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div
                className={
                  `flex justify-center font-bold ` +
                  (d.isJiniSendTxt === true
                    ? "text-white text-xl bg-pink-700 p-2 rounded-2xl"
                    : "text-slate-600")
                }
              >
                {d.company}-{d.key}
              </div>
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              className=''
              dangerouslySetInnerHTML={{
                __html: DateUtils.stringToDate(d.orderTime),
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center font-bold'>
                <div className='text-xs'>{d.orderTitle}</div>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                {d.user.company}/{d.user.name}/{d.user.position}
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.user.phone}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.user.email}</div>
            </StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              className=''
              dangerouslySetInnerHTML={{
                __html: `${DateUtils.iso8601DateToString(d.boardingDate)}`,
              }}
            ></StyledTableCell>
            <StyledTableCell
              component='th'
              scope='row'
              className=''
              dangerouslySetInnerHTML={{
                __html: `${d.isIamweb ? "-" : ""}${d.customName}</br>${
                  d.customPhone
                }`,
              }}
            ></StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                {else01Json === undefined ? (
                  d.startLocation === "" ? (
                    d.startAirport
                  ) : (
                    d.startLocation
                  )
                ) : (
                  <div className='flex flex-col justify-center text-center'>
                    <div className='font-bold'>[시간대절]출발지/도착지</div>
                    <div className='font-bold text-red-600'>
                      {else01Json.start_goal}
                    </div>
                    <div className='font-bold'>[시간대절]여행루트</div>
                    <div className='font-bold text-red-600'>
                      {else01Json.trip_route}
                    </div>
                  </div>
                )}
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                {else01Json === undefined ? (
                  d.goalLocation === "" ? (
                    d.goalAirport
                  ) : (
                    d.goalLocation
                  )
                ) : (
                  <div className='flex flex-col justify-center text-center'>
                    <div className='font-bold'>[시간대절]시간대절</div>
                    <div className='font-bold text-red-600'>
                      {else01Json.timezon}
                    </div>
                  </div>
                )}
              </div>
            </StyledTableCell>
            {user?.role !== "USER" ? (
              <StyledTableCell component='th' scope='row'>
                <div className='flex justify-center'>
                  {d.status === EnumDispatchStatus.IAMWEB_ORDER ? (
                    <div className='font-bold text-orange-600'>배차요청전</div>
                  ) : (
                    <Button
                      variant='contained'
                      className='w-10 mr-2 font-bold text-black bg-green-300 hover:bg-slate-800 hover:text-white'
                      onClick={() => onModifyDispatch(d)}
                    >
                      배차
                    </Button>
                  )}
                </div>
              </StyledTableCell>
            ) : (
              <StyledTableCell component='th' scope='row'>
                <div className='flex justify-center'>
                  {d.status === EnumDispatchStatus.IAMWEB_ORDER ? (
                    <div className='font-bold text-orange-600'>배차요청전</div>
                  ) : d.status === EnumDispatchStatus.DISPATCH_ING ? (
                    <div className='font-bold text-orange-600'>배차확인중</div>
                  ) : (
                    <Button
                      variant='contained'
                      className='w-10 mr-2 font-bold text-black bg-green-300 hover:bg-slate-800 hover:text-white'
                      onClick={() => onModifyDispatch(d)}
                    >
                      배차확인
                    </Button>
                  )}
                </div>
              </StyledTableCell>
            )}
          </StyledTableRow>
        );
      })
    );
  };

  return (
    <>
      <AdminLayout menuTitle={"아이웹 주문 관리"}>
        <div className='p-5 bg-gray-500'>
          <TableTemplate
            title='아임웹 주문 관리'
            headers={headers}
            headerWidths={headerWidths}
            body={body}
            listCallUrl={APIURLs.ORDER_LIST}
            reload={reload}
            message={message!}
            setMessage={setMessage}
            onCreate={onCreateOpen}
            isShowSearch={true}
            reloadList={reloadList}
          />

          {openModal ? (
            <ManageDispatchModal
              uiType={uiType}
              open={openModal}
              handleModalClose={handleModalClose}
              order={selectOrder}
              setReloadList={setReloadList}
            />
          ) : (
            ""
          )}
        </div>
      </AdminLayout>
    </>
  );
}

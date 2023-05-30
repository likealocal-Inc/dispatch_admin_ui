import { useEffect, useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { UserModel } from "@libs/client/models/user.model";
import { getHTMLElementByID } from "@libs/client/utils/html";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { callAPI } from "@libs/client/call/call";
import { MessageProps } from "@components/MessageShow/show";
import ManageUserModal from "./manageUser";
import TableTemplate from "@components/ListTable/TableTemplate";
import Button02 from "@components/buttons/Button02";
import AdminLayout from "@components/layouts/AdminLayout";

export default function Users() {
  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();

  // 화면 재로딩
  const [reload, setReload] = useState(0);

  // 모달 관련 설정
  const [isModify, setIsModify] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectUser, setSelectUser] = useState<UserModel>();

  const onOpenModify = (user: UserModel) => {
    setSelectUser(user);
    setOpenModal(true);
  };

  const handleCreateModalOpen = () => {
    setIsModify(false);
    setOpenModal(true);
  };

  const handleModalClose = (isChange: boolean = false) => {
    setOpenModal(false);
    if (isChange) setReload(reload + 1);
  };

  const headers = [
    "Email",
    "company",
    "phone",
    "생성일",
    "수정일",
    "권한",
    "활성화",
    "삭제",
  ];
  const headerWidths = [10, 20, 20, 20, 20, 10, 10, 10];
  const body = (res: UserModel[]) => {
    return (
      res &&
      res.map((d, key) => {
        return (
          <StyledTableRow
            key={key}
            className='transition duration-300 ease-in-out border-b hover:bg-gray-300'
          >
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                <Button02 onClick={() => onOpenModify(d)} label={d.email} />
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.company}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.phone}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.created.toString()}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.updated.toString()}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>{d.role}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    id={"i--" + d.id.toString()}
                    type='checkbox'
                    value=''
                    className='sr-only peer'
                    {...(d.isActive ? { checked: true } : { checked: false })}
                    onChange={(e) => {
                      callAPI({
                        urlInfo: {
                          url: `${APIURLs.USER_UPDATE.url}/${
                            d.id
                          }/${!d.isActive}`,
                          method: APIURLs.USER_UPDATE.method,
                          desc: APIURLs.USER_UPDATE.desc,
                        },
                      }).then((res) => {
                        d.isActive = !d.isActive;
                        if (d.isActive) {
                          getHTMLElementByID<HTMLInputElement>(
                            "i--" + d.id.toString()
                          ).checked = true;
                        } else {
                          getHTMLElementByID<HTMLInputElement>(
                            "i--" + d.id.toString()
                          ).checked = false;
                        }

                        setMessage({
                          message: `사용자 활성화: UserID:[${d.id}] ${
                            d.isActive ? "활성화" : "비활성화"
                          }`,
                          type: "S",
                        });
                      });
                    }}
                  />
                  <div className="w-11 h-6  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600" />
                </label>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row'>
              <div className='flex justify-center'>
                <Button02
                  label={"삭제"}
                  onClick={() => {
                    callAPI({
                      urlInfo: {
                        url: `${APIURLs.USER_DELETE.url}/${d.id}`,
                        method: APIURLs.USER_DELETE.method,
                        desc: APIURLs.USER_DELETE.desc,
                      },
                    }).then((res) => {
                      location.reload();
                    });
                  }}
                />
              </div>
            </StyledTableCell>
          </StyledTableRow>
        );
      })
    );
  };

  return (
    <>
      <AdminLayout menuTitle={"사용자 관리"}>
        <div className='h-screen p-5 bg-gray-500'>
          <div className='flex items-center justify-end p-2'>
            <button
              className='w-24 h-10 mr-2 font-bold text-white rounded-lg bg-slate-800 hover:bg-amber-300 hover:text-red-700'
              onClick={() => handleCreateModalOpen()}
            >
              생성
            </button>
          </div>
          <TableTemplate
            title='사용자 관리'
            headers={headers}
            headerWidths={headerWidths}
            body={body}
            listCallUrl={APIURLs.USER_LIST}
            reload={reload}
            message={message!}
            setMessage={setMessage}
            onCreate={handleCreateModalOpen}
          />

          <ManageUserModal
            isModify={isModify}
            open={openModal}
            user={selectUser}
            handleModalClose={handleModalClose}
          />
        </div>
      </AdminLayout>
    </>
  );
}

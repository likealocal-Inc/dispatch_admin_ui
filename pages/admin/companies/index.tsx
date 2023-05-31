import { useEffect, useState } from "react";

import { APIURLs } from "@libs/client/constants";
import { getHTMLElementByID } from "@libs/client/utils/html.utils";
import { StyledTableCell, StyledTableRow } from "@libs/client/ui/table";
import { callAPI } from "@libs/client/call/call";
import { MessageProps } from "@components/MessageShow/show";
import TableTemplate from "@components/ListTable/TableTemplate";
import Button02 from "@components/buttons/Button02";
import { CompanyModel } from "@libs/client/models/company.model";
import ManageCompanyModal from "./manageCompany";
import AdminLayout from "@components/layouts/AdminLayout";

export default function Users() {
  const isHeader = "i--";

  // 메세지 출력관련
  const [message, setMessage] = useState<MessageProps>();

  // 화면 재로딩
  const [reload, setReload] = useState(0);

  // 모달 관련 설정
  const [isModify, setIsModify] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectUser, setSelectUser] = useState<CompanyModel>();

  const handleModalOpen = (compay: CompanyModel) => {
    setSelectUser(compay);
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

  const headers = ["name", "생성일", "수정일", "활성화", "삭제"];
  const headerWidths = [10, 20, 20, 10, 10];
  const body = (res: CompanyModel[]) => {
    return (
      res &&
      res.map((d, key) => {
        return (
          <StyledTableRow
            key={key}
            className='transition duration-300 ease-in-out border-b hover:bg-gray-300'
          >
            <StyledTableCell component='th' scope='row' className=''>
              <div className='flex justify-center'>
                <button
                  onClick={() => handleModalOpen(d)}
                  type='button'
                  className='inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out w-full'
                >
                  {d.name}
                </button>
              </div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row' className='r'>
              <div className='flex justify-center'>{d.created.toString()}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row' className='text-center'>
              <div className='flex justify-center'>{d.updated.toString()}</div>
            </StyledTableCell>
            <StyledTableCell component='th' scope='row' className='text-center'>
              <div className='flex justify-center'>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    id={isHeader + d.id.toString()}
                    type='checkbox'
                    value=''
                    className='sr-only peer'
                    {...(d.isActive ? { checked: true } : { checked: false })}
                    onChange={(e) => {
                      callAPI({
                        urlInfo: APIURLs.COMPANY_UPDATE,
                        addUrlParams: `/${d.id}/${!d.isActive}`,
                      }).then((res) => {
                        d.isActive = !d.isActive;
                        if (d.isActive) {
                          getHTMLElementByID<HTMLInputElement>(
                            isHeader + d.id.toString()
                          ).checked = true;
                        } else {
                          getHTMLElementByID<HTMLInputElement>(
                            isHeader + d.id.toString()
                          ).checked = false;
                        }

                        setMessage({
                          message: `업체 활성화: Company Name:[${d.name}] ${
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
            <StyledTableCell component='th' scope='row' className='text-center'>
              <div className='flex justify-center'>
                <Button02
                  label={"삭제"}
                  onClick={() => {
                    callAPI({
                      urlInfo: APIURLs.COMPANY_DELETE,
                      addUrlParams: `/${d.id}`,
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
      <AdminLayout menuTitle={"업체 관리"}>
        <div className='h-screen p-5 bg-gray-500'>
          <TableTemplate
            title='사용자 관리'
            headers={headers}
            headerWidths={headerWidths}
            body={body}
            listCallUrl={APIURLs.COMPANY_LIST}
            reload={reload}
            message={message!}
            setMessage={setMessage}
            onCreate={handleCreateModalOpen}
            isShowSearch={false}
          />

          <ManageCompanyModal
            isModify={isModify}
            open={openModal}
            company={selectUser}
            handleModalClose={handleModalClose}
          />
        </div>
      </AdminLayout>
    </>
  );
}

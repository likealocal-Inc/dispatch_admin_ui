import { UserModel } from "@libs/client/models/user.model";
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
import { getHTMLElementByID } from "../../../libs/client/utils/html.utils";
import { useEffect, useState } from "react";
import { callAPI } from "@libs/client/call/call";
import { CompanyModel } from "@libs/client/models/company.model";
import { SelectBoxCompanyList } from "@libs/client/utils/dispatch.ui.utils";

interface ModalProps {
  isModify: boolean;
  user?: UserModel;
  open: boolean;
  handleModalClose: Function;
}

export default function ManageUserModal({
  open,
  user,
  handleModalClose,
  isModify,
}: ModalProps) {
  const [isFirst, setIsFirst] = useState(true);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: isModify && open ? APIURLs.USER_UPDATE : APIURLs.JOIN,
    addUrlParams: isModify && open ? `/${user!.id}` : "",
  });

  const [message, setMessage] = useState("");

  const [companyList, setCompanyList] = useState<CompanyModel[]>([]);

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

  useEffect(() => {
    callAPI({
      urlInfo: APIURLs.COMPANY_LIST,
      params: { size: 99999, page: 0 },
    }).then(async (d) => {
      const data = await d.json();
      setCompanyList(data.data.data);
    });
  }, []);

  const onSubmit = () => {
    const phone = getHTMLElementByID<HTMLInputElement>("m-phone").value;
    const password = getHTMLElementByID<HTMLInputElement>("m-password").value;
    const email = getHTMLElementByID<HTMLInputElement>("m-email").value;
    const position = getHTMLElementByID<HTMLInputElement>("m-position").value;
    const name = getHTMLElementByID<HTMLInputElement>("m-name").value;
    if (isModify === false) {
      const companyObj = getHTMLElementByID<HTMLSelectElement>("m-company");
      const company = companyObj.options[companyObj.selectedIndex].value;
      call({ phone, company, password, email, position, name });
    } else {
      call({ phone, password, email, position, name });
    }
  };

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
                  <div className='p-2 font-bold text-center text-gray-800'>
                    사용자 {isModify ? "수정" : "생성"}
                  </div>
                </Typography>
                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack>
                    <Card className='p-6'>
                      <div className='flex flex-row items-center w-72'>
                        <div className='w-24'>이메일</div>
                        <TextField
                          id='m-email'
                          defaultValue={isModify ? user!.email : ""}
                          className={`w-full`}
                          InputProps={{
                            readOnly: isModify ? true : false,
                          }}
                        />
                      </div>
                      {true && (
                        <div className='flex flex-row items-center w-72'>
                          <div className='w-24'>패스워드</div>
                          <TextField
                            id='m-password'
                            type='password'
                            className='w-full py-3'
                          />
                          {isModify ?? (
                            <div className='flex justify-center pb-6 text-sm text-red-500'>
                              패스워드는 입력안하면 저장안됨
                            </div>
                          )}
                        </div>
                      )}
                      <div className='flex flex-row items-center w-72'>
                        <div className='w-24'>전화번호</div>
                        <TextField
                          id='m-phone'
                          defaultValue={isModify ? user!.phone : ""}
                          className='w-full py-3'
                        />
                      </div>
                      <div className='flex flex-row items-center w-72'>
                        <div className='w-24'>회사명</div>
                        {false ? (
                          <div className='w-full p-2 border-2 rounded-lg bg-slate-200'>
                            {user?.company}
                          </div>
                        ) : (
                          <SelectBoxCompanyList
                            id={"m-company"}
                            onChange={(d: string) => {}}
                            selectCompany={user?.company}
                            required={true}
                          />
                        )}

                        {/* <select
                          className='text-sm duration-150 bg-white rounded shadow w-72 placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring'
                          id='m-company'
                          required={true}
                        >
                          {companyList.length > 0 &&
                            companyList.map((d, key) => {
                              return (
                                <option
                                  key={d.id}
                                  defaultValue={d.name}
                                  selected={
                                    isModify
                                      ? d.name === user!.company
                                        ? true
                                        : false
                                      : false
                                  }
                                >
                                  {d.name}
                                </option>
                              );
                            })}
                        </select> */}
                      </div>

                      <div className='flex flex-row items-center w-72'>
                        <div className='w-24'>직급</div>
                        <TextField
                          id='m-position'
                          defaultValue={isModify ? user!.position : ""}
                          className='w-full py-3'
                        />
                      </div>
                      <div className='flex flex-row items-center w-72'>
                        <div className='w-24'>이름</div>
                        <TextField
                          id='m-name'
                          defaultValue={isModify ? user!.name : ""}
                          className='w-full'
                        />
                      </div>
                    </Card>
                    <div
                      className={
                        message === ""
                          ? "hidden "
                          : "flex justify-center p-2 m-2 font-bold text-red-500 border-2 "
                      }
                    >
                      {message}
                    </div>
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
                  </Stack>
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
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

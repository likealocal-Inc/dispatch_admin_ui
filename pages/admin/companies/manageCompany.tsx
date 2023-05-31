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
import { CompanyModel } from "@libs/client/models/company.model";

interface ModalProps {
  isModify: boolean;
  company?: CompanyModel;
  open: boolean;
  handleModalClose: Function;
}

export default function ManageCompanyModal({
  open,
  company,
  handleModalClose,
  isModify,
}: ModalProps) {
  const [isFirst, setIsFirst] = useState(true);
  const [call, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: isModify && open ? APIURLs.COMPANY_UPDATE : APIURLs.COMPANY_CREATE,
    addUrlParams: isModify && open ? `/${company!.id}` : "",
  });

  const [message, setMessage] = useState("");

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

  const onSubmit = () => {
    const name = getHTMLElementByID<HTMLInputElement>("m-name").value;
    if (name.trim() === "") {
      setMessage("업체명을 넣어 주세요");
    } else {
      call({ name });
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
                  <div className='p-2 text-center text-gray-800'>
                    업체이름 {isModify ? "수정" : "생성"}
                  </div>
                </Typography>
                {loading && <div>Loading...</div>}
                <div className=''>
                  <Stack>
                    <Card className='p-6'>
                      <TextField
                        id='m-name'
                        label='업체명'
                        defaultValue={isModify ? company!.name : ""}
                        className='w-full py-5'
                      />
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
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

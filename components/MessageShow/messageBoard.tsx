import { Alert } from "@mui/material";
import { useState, useEffect } from "react";

export interface MessageObj {
  key: number;
  type: "E" | "S";
  msg: string;
  time: number;
}

export default function MessageBoard(msges: MessageObj[], close: Function) {
  const [msgArr, setMsgArr] = useState<MessageObj[]>([]);
  const [isCheck, setIsCheck] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setIsCheck(!isCheck);
    }, 3000);
    setMsgArr(msges);
  }, [msges]);

  return (
    <>
      {msgArr.map((item, i) => {
        isCheck;
        const time = Date.now();

        if (time - item.time > 3000) return;

        return (
          <div key={i}>
            <Alert
              severity={`${item.type == "E" ? "error" : "success"}`}
              onClick={(e) => {
                close(item.key);
              }}
            >
              {item.msg}
            </Alert>
            <div className='py-2'></div>
          </div>
        );
      })}
    </>
  );
}

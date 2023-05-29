import { useEffect, useState } from "react";
import MessageBoard, { MessageObj } from "./messageBoard";

export interface MessageProps {
  message: string;
  type: "E" | "S";
}

export interface MessageShowProps {
  message?: MessageProps;
  setMessage: Function;
}

export const MessageShow = ({ setMessage, message }: MessageShowProps) => {
  const [messageList, setMessageList] = useState<MessageObj[]>([]);
  const [indexNumber, setIndexNumber] = useState(0);

  useEffect(() => {
    if (message === undefined) return;
    addMessage(message);
  }, [setMessage, message]);

  async function addMessage({ message, type }: MessageProps) {
    const _msg = {
      msg: message,
      type: type,
      key: indexNumber,
      time: Date.now(),
    };
    await setIndexNumber(indexNumber + 1);
    await setMessageList([...messageList, _msg]);
  }

  return (
    <div className='fixed right-0 bottom-10 w-96 '>
      {MessageBoard(messageList, (key: number) => {
        setMessageList(messageList.filter((d) => d.key != key));
      })}
    </div>
  );
};

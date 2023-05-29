import { callAPI } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import { OrderModel } from "@libs/client/models/order.model";
import React, { useEffect, useState } from "react";

interface ModalModifyProps {
  isJson?: boolean;
  isOpen: boolean;
  setIsOpen: Function;
  data: string;
  setData: Function;
  modifyCallback: Function;
}
function ModalOrderIamwebModify({
  isJson = false,
  isOpen,
  setIsOpen,
  data,
  modifyCallback,
}: ModalModifyProps) {
  const [origin, setOrigin] = useState(data);

  const [originJson, setOriginJson] = useState<any>();

  const closeModal = () => {
    // 그냥 닫으면 변경된 값을 취소 해야 함
    setIsOpen(false);
  };
  const runModify = () => {
    setIsOpen(false);
    if (isJson) {
      modifyCallback(JSON.stringify(originJson));
    } else {
      modifyCallback(origin);
    }
  };

  useEffect(() => {
    if (isJson) {
      const tempJsonData = JSON.parse(data);
      setOriginJson(tempJsonData);
    } else {
      setOrigin(data);
    }
  }, [data]);

  useEffect(() => {}, [modifyCallback]);

  return (
    <div className='p-6'>
      {isOpen && (
        <div
          className='fixed inset-0 z-10 overflow-y-auto'
          aria-labelledby='modal-title'
          role='dialog'
          aria-modal='true'
        >
          <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div
              className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
              onClick={closeModal}
            ></div>

            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>

            <div className='inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-middle transition-all transform rounded-lg shadow-xl bg-slate-300'>
              <div>
                <div className='flex flex-col justify-center'>
                  {isJson ? (
                    <>
                      {originJson !== undefined
                        ? Object.keys(originJson).map((d) => {
                            return (
                              <div
                                key={d}
                                className='flex flex-row justify-between p-3'
                              >
                                <div className='p-2'>{d}</div>
                                <input
                                  className='p-3'
                                  id={d}
                                  defaultValue={originJson[d]}
                                  onChange={(e) => {
                                    const div = document.getElementById(d);
                                    div!.innerHTML = e.target.value;
                                    originJson[d] = e.target.value;
                                    setOriginJson(originJson);
                                  }}
                                />
                              </div>
                            );
                          })
                        : "NO"}
                    </>
                  ) : (
                    <input
                      className='p-3 rounded-lg'
                      value={origin}
                      onChange={(v) => {
                        setOrigin(v.target.value);
                      }}
                    />
                  )}
                </div>
              </div>
              <div className='mt-5 sm:mt-6'>
                <button
                  type='button'
                  className='inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm'
                  onClick={runModify}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalOrderIamwebModify;

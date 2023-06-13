export enum EnumDispatchStatus {
  IAMWEB_ORDER = "IAMWEB_ORDER", // 아임웹 주문
  DISPATCH_ING = "DISPATCH_ING", // 확인중
  DISPATCH_MODIFIED = "DISPATCH_MODIFIED", // 수정
  DISPATCH_REQUEST = "DISPATCH_REQUEST", // 배차요청
  DISPATCH_REQUEST_CANCEL = "DISPATCH_REQUEST_CANCEL", // 배차요청취소
  DISPATCH_COMPLETE = "DISPATCH_COMPLETE", // 배차완료
  DISPATCH_NO = "DISPATCH_NO", // 미배차
  DISPATCH_CANCEL = "DISPATCH_CANCEL", // 배차취소
  DONE = "DONE", // 완료
}

export const DispatchUtils = {
  statusList: [
    "DISPATCH_REQUEST",
    "DISPATCH_REQUEST_CANCEL",
    "DISPATCH_MODIFIED",
    "DISPATCH_ING",
    "DISPATCH_COMPLETE",
    "DISPATCH_NO",
    "DISPATCH_CANCEL",
    "DONE",
  ],
  status: new Map<string, string>([
    [EnumDispatchStatus.IAMWEB_ORDER.toString(), "아임웹주문"],
    [EnumDispatchStatus.DISPATCH_REQUEST.toString(), "배차요청"],
    [EnumDispatchStatus.DISPATCH_MODIFIED.toString(), "배차수정함"],
    [EnumDispatchStatus.DISPATCH_REQUEST_CANCEL.toString(), "배차요청취소"],
    [EnumDispatchStatus.DISPATCH_ING.toString(), "확인중"],
    [EnumDispatchStatus.DISPATCH_COMPLETE.toString(), "배차완료"],
    [EnumDispatchStatus.DISPATCH_NO.toString(), "미배차"],
    [EnumDispatchStatus.DISPATCH_CANCEL.toString(), "배차취소"],
    [EnumDispatchStatus.DONE.toString(), "완료"],
  ]),
  getStatusString: (status: string): string => {
    return DispatchUtils.status.get(status) ?? "ERROR";
  },
};

export enum EnumDispatchStatus {
  IAMWEB_ORDER = "IAMWEB_ORDER",
  DISPATCH_ING = "DISPATCH_ING",
  DISPATCH_COMPLETE = "DISPATCH_COMPLETE",
  DISPATCH_NO = "DISPATCH_NO",
  DISPATCH_CANCEL = "DISPATCH_CANCEL",
  DONE = "DONE",
}

export const DispatchUtils = {
  statusList: [
    "DISPATCH_ING",
    "DISPATCH_COMPLETE",
    "DISPATCH_NO",
    "DISPATCH_CANCEL",
    "DONE",
  ],
  status: new Map<string, string>([
    [EnumDispatchStatus.IAMWEB_ORDER.toString(), "아임웹주문"],
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

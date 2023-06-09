export interface DispatchModel {
  id: number;
  created: Date;
  updated: Date;
  carCompany: string;
  jiniName: string;
  carInfo: string;
  jiniPhone: string;
  baseFare: number;
  addFare: number;
  totalFare: number;
  else01: string;
  else02: string;
  else03: string;
  userId: number;
  orderId: number;

  // 2023.06.09 추가 (초과요금, 차량타입, 결제방식, 메모)
  exceedFare: number;
  payType: string;
  carType: string;
  memo: string;
}

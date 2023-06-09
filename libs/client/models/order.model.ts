import { UserModel } from "./user.model";

export interface OrderModel {
  id: number;
  created: Date;
  updated: Date;
  isIamweb: boolean;
  iamwebOrderNo: string;
  orderTime: string;
  orderTitle: string;
  boardingDate: string;
  startLocation: string;
  startAddress: string;
  goalLocation: string;
  goalAddress: string;
  startAirport: string;
  goalAirport: string;
  information: string;
  else01: string;
  else02: string;
  status: string;
  userId: number;
  user: UserModel;
  company: string;

  // 2023.06.09추가 (탑승자, 탑승자전번)
  customName: string;
  customPhone: string;

  key: number;

  isJiniSendTxt: boolean; // 지니에게 문자를 보냈는지 여부
}

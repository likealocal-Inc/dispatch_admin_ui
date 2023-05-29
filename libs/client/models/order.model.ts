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
}

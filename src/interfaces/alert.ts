import { EOrderStatus } from "./order";

export enum EAlertType {
  REP_ORDER = 1,
  REP_SIGNUP = 2,
  COMMISSIONS = 3,
  CELEBRATION = 4,
}

export interface IAlert {
  id: string;
  type: EAlertType;
  fromDate: Date | string;
  toDate: Date | string;
  amount: number;
  orderId: number;
  orderStatus: EOrderStatus;
  nameRef: string;
  emailRef: string;
  renewOn: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: number;
  order?: {
    orderCustomId: string;
    createAt: Date | string;
  };
}

export interface IAlertCount {
  type: EAlertType;
  count: number;
}

import { IUserInfo } from "./user";

export interface ITolaVolumeItem {
  id: number;
  action: number;
  status: ETotalVolumeAction;
  amount: number;
  hashCustom: string | undefined;
  description: string;
  userId: number;
  userCurrBalance: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  withDrawRequest?: {
    txHash: string;
  };
  user: {
    userName: string;
  };
}

export enum ETotalVolumeAction {
  deposit = 0,
  withdraw = 1,
}

export enum EWithDrawStatus {
  CREATED = 0,
  PROCESSING = 1,
  FINISHED = 2,
  REJECTED = 3,
  APPROVED = 4,
}

export interface IWithdrawItem {
  id: number;
  amount: number;
  type: number;
  status: EWithDrawStatus;
  orderCustomId: string;
  reason: string | null;
  receiverAddress: string;
  createdBy: number;
  receiverEmail: string;
  receiverId: number | null;
  network: string;
  tokenAddress: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  txHash: string;
  ActivityHistoryId: number;
  user: IUserInfo;
}

type TRecentlyActivityItem = {
  present: number;
  previous: number;
};
export interface IRecentlyActivityResponse {
  totalUser: TRecentlyActivityItem;
  visitors: TRecentlyActivityItem;
  totalOrderSuccess: TRecentlyActivityItem;
  totalOrder: TRecentlyActivityItem;
}

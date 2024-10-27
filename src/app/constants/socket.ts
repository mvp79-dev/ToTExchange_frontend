import { EOrderStatus } from "@/interfaces/order";

export enum SocketEvent {
  events = "events",
}

export enum EActivityAction {
  DEPOSIT,
  WITHDRAW,
  REP_ORDER,
  REP_SIGNUP,
  BUY_NFT,
  UPGRADE_NFT,
  CANCEL_ORDER,
}
export enum ESocketAction {
  DEPOSIT,
  WITHDRAW,
  REP_ORDER,
  REP_SIGNUP,
  BUY_NFT,
}

export enum ERoomSocket {
  joinRoom = "joinRoom",
  leaveRoom = "leaveRoom",
  user = "user",
}

export interface IPayloadListenSocket {
  action: number;
  data: {
    hashCustom: string;
    action: number;
    amount: number;
    status: number;
  };
}

export interface IPayloadNotifySocket {
  action: number;
  data: {
    name?: string;
    email?: string;
    id?: number;
    status?: EOrderStatus;
    createdAt: string;
  };
}

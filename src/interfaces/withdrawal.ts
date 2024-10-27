import {
  ERecipientType,
  EWithdrawReceiverType,
} from "@/app/constants/withdrawal";

export interface IWithdrawForm {
  currency: string;
  receiverType: EWithdrawReceiverType;
  walletUser: {
    walletAddress: string;
    network: string;
    withdrawWalletType: string;
    amount: string;
  };
  internalUser: {
    recipientType: ERecipientType;
    amount: string;
    recipient: string;
  };
}

export interface IRequestWithdraw {
  amount: number;
  type: E_WITHDRAW_TYPE;
  receiverAddress?: string;
  receiverEmail?: string;
  receiverId?: number;
  network?: number | string;
  tokenAddress?: string;
  otp: number;
}

export enum E_WITHDRAW_TYPE {
  TRANSFER_TO_USER,
  TO_EXTERNAL_WALLET,
}

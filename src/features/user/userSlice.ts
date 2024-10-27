import { IShippingAddressForm } from "@/interfaces/shippingAddress";
import {
  IMyNFT,
  IMySponsor,
  IInfoWithdrawToday,
  IUserInfo,
} from "@/interfaces/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FetchBalanceResult } from "wagmi/actions";
import { TRootState } from "../../app/store";

export interface IUserState {
  user: IUserInfo | undefined;
  mySponsor: IMySponsor | undefined;
  shippingAddress: IShippingAddressForm[];
  balanceUSDT: number;
  balanceNetwork: FetchBalanceResult | undefined;
  myNFT: IMyNFT | undefined;
  infoWithdrawToday: IInfoWithdrawToday | undefined;
}

const initialState: IUserState = {
  user: undefined,
  mySponsor: undefined,
  shippingAddress: [],
  balanceUSDT: 0,
  balanceNetwork: undefined,
  myNFT: undefined,
  infoWithdrawToday: undefined,
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getUserInfoRequest: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getUserInfoSuccess: (state, actions: PayloadAction<IUserInfo>) => {
      state.user = actions.payload;
    },
    getInfoMySponsorRequest: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getInfoMySponsorSuccess: (state, actions: PayloadAction<IMySponsor>) => {
      state.mySponsor = actions.payload;
    },
    getUserShippingRequest: () => {},
    getUserShippingAddressSuccess: (
      state,
      actions: PayloadAction<IShippingAddressForm[]>
    ) => {
      state.shippingAddress = actions.payload;
    },
    getBalanceSuccess: (state, actions: PayloadAction<number>) => {
      state.balanceUSDT = actions.payload;
    },
    getBalanceNetworkSuccess: (
      state,
      actions: PayloadAction<FetchBalanceResult>
    ) => {
      state.balanceNetwork = actions.payload;
    },
    getMyNftRequest: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getMyNftSuccess: (state, actions: PayloadAction<IMyNFT>) => {
      state.myNFT = actions.payload;
    },
    getInfoWithdrawToDayRequest: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getInfoWithdrawToDaySuccess: (
      state,
      actions: PayloadAction<IInfoWithdrawToday>
    ) => {
      state.infoWithdrawToday = actions.payload;
    },
    getCommissionsHistoryRequest: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getCommissionsHistorySuccess: (
      state,
      actions: PayloadAction<IUserInfo>
    ) => {
      state.user = actions.payload;
    },
    logoutAccountSuccess: (state) => {
      state.user = undefined;
    },
  },
});

export const userActions = userSlide.actions;

export const userSelect = (state: TRootState) => state.user;

export default userSlide.reducer;

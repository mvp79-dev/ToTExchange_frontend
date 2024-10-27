import { ICategoryMenu } from "@/interfaces/category";
import { ICurrency } from "@/interfaces/currency";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TRootState } from "../../app/store";
import { IUserConfig } from "@/interfaces/common";

interface IInitialState {
  listCurrency: ICurrency[];
  listCategory: ICategoryMenu[];
  userConfigs?: IUserConfig;
}

const initialState: IInitialState = {
  listCurrency: [],
  listCategory: [],
  userConfigs: undefined,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    getListCurrencyRequest: () => {},
    getListCurrencySuccess: (state, actions: PayloadAction<ICurrency[]>) => {
      state.listCurrency = actions.payload;
    },
    getListCategoryRequest: () => {},
    getListCategorySuccess: (
      state,
      actions: PayloadAction<ICategoryMenu[]>
    ) => {
      state.listCategory = actions.payload;
    },
    getUserConfigsRequest: () => {},
    getUserConfigsSuccess: (state, actions: PayloadAction<IUserConfig>) => {
      state.userConfigs = actions.payload;
    },
  },
});

export const appActions = appSlice.actions;

export const AppSelect = (state: TRootState) => state.app;

export default appSlice.reducer;

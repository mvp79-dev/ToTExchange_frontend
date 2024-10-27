import { TRootState } from "@/app/store";
import { IAlert } from "@/interfaces/alert";
import { IQuery, IResponseArray } from "@/interfaces/common";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER = "";
const DEFAULT_TOTAL_PAGE = 0;
const DEFAULT_TOTAL_ITEM = 0;

export const DEFAULT_CONDITION_ALERTS: IQuery = {
  page: DEFAULT_PAGE,
  size: DEFAULT_PAGE_SIZE,
  filter: DEFAULT_FILTER,
};

interface IInitialState {
  condition: IQuery;
  listAlert: IAlert[];
  totalPage: number;
  totalItems: number;
}

const initialState: IInitialState = {
  condition: DEFAULT_CONDITION_ALERTS,
  listAlert: [],
  totalPage: DEFAULT_TOTAL_PAGE,
  totalItems: DEFAULT_TOTAL_ITEM,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    getListAlertsRequest: (state, action: PayloadAction<IQuery>) => {},
    getListAlertSuccess: (
      state,
      actions: PayloadAction<IResponseArray<IAlert>>
    ) => {
      state.listAlert = actions.payload.data;
      state.totalPage = actions.payload.meta.totalPages;
      state.totalItems = actions.payload.meta.count;
    },
    updateCondition: (state, action: PayloadAction<IQuery>) => {
      state.condition = action.payload;
    },
    resetCondition: (state) => {
      state.condition = DEFAULT_CONDITION_ALERTS;
    },
  },
});

export const alertActions = alertSlice.actions;

export const AlertSelect = (state: TRootState) => state.alert;

export default alertSlice.reducer;

import { TRootState } from "@/app/store";
import { IQuery, IResponseArray } from "@/interfaces/common";
import { IOrder } from "@/interfaces/order";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER = "";
const DEFAULT_TOTAL_PAGE = 0;
const DEFAULT_TOTAL_ITEM = 0;

const DEFAULT_CONDITION: IQuery = {
  page: DEFAULT_PAGE,
  size: DEFAULT_PAGE_SIZE,
  filter: DEFAULT_FILTER,
};

interface IInitialState {
  listOrders: IOrder[];
  totalPage: number;
  totalItems: number;
  condition: IQuery;
}

const initialState: IInitialState = {
  listOrders: [],
  totalPage: 0,
  totalItems: 0,
  condition: DEFAULT_CONDITION,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    getListOrdersRequest: (state, action: PayloadAction<IQuery>) => {},
    getListOrdersSuccess: (
      state,
      actions: PayloadAction<IResponseArray<IOrder>>
    ) => {
      state.listOrders = actions.payload.data;
      state.totalPage = actions.payload.meta.totalPages;
      state.totalItems = actions.payload.meta.count;
    },
    getListAdminOrdersRequest: (state, action: PayloadAction<IQuery>) => {},
    getListAdminOrdersSuccess: (
      state,
      actions: PayloadAction<IResponseArray<IOrder>>
    ) => {
      state.listOrders = actions.payload.data;
      state.totalPage = actions.payload.meta.totalPages;
      state.totalItems = actions.payload.meta.count;
    },
    updateOrderCondition: (state, action: PayloadAction<IQuery>) => {
      state.condition = action.payload;
    },
    resetCondition: (state) => {
      state.condition = DEFAULT_CONDITION;
    },
  },
});

export const orderAction = orderSlice.actions;

export const orderSelect = (state: TRootState) => state.order;

export default orderSlice.reducer;

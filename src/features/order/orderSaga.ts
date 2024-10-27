import { call, put, takeLatest } from "redux-saga/effects";
import { orderAction } from "./orderSlice";
import { orderServices } from "@/service/orderServices";
import { PayloadAction } from "@reduxjs/toolkit";
import { IQuery } from "@/interfaces/common";

function* getListOrders(action: PayloadAction<IQuery>) {
  const { payload: query } = action;
  try {
    const { data, meta } = yield call(orderServices.getListOrders, query);
    yield put(orderAction.getListOrdersSuccess({ data, meta }));
  } catch (error) {
    return;
  }
}

function* getAdminOrders(action: PayloadAction<IQuery>) {
  const { payload: query } = action;
  try {
    const { data, meta } = yield call(orderServices.getAdminOrderList, query);
    yield put(orderAction.getListAdminOrdersSuccess({ data, meta }));
  } catch (error) {
    return;
  }
}

export default function* orderSaga() {
  yield takeLatest(orderAction.getListOrdersRequest.type, getListOrders);
  yield takeLatest(orderAction.getListAdminOrdersRequest.type, getAdminOrders);
}

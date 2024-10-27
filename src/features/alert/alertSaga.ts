import { IQuery } from "@/interfaces/common";
import { alertService } from "@/service/alertService";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { alertActions } from "./alertSlice";

function* getListAlerts(action: PayloadAction<IQuery>) {
  const { payload: query } = action;
  try {
    const { data, meta } = yield call(alertService.getListAlert, query);
    yield put(alertActions.getListAlertSuccess({ data, meta }));
  } catch (err) {
    return;
  }
}
export default function* alertSaga() {
  yield takeLatest(alertActions.getListAlertsRequest.type, getListAlerts);
}

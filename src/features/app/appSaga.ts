import { ICategoryMenu } from "@/interfaces/category";
import { ICurrency } from "@/interfaces/currency";
import { appServices } from "@/service/appService";
import { userServices } from "@/service/userService";
import { call, put, takeLatest } from "redux-saga/effects";
import { appActions } from "./appSlice";
import { IUserConfig } from "@/interfaces/common";

function* getListCurrency() {
  try {
    const response: ICurrency[] = yield call(userServices.getListCurrency);
    yield put(appActions.getListCurrencySuccess(response));
  } catch (error) {
    return;
  }
}

function* getListCategory() {
  try {
    const response: { data: ICategoryMenu[] } = yield call(
      appServices.getListCategory
    );
    yield put(appActions.getListCategorySuccess(response.data));
  } catch (error) {
    return;
  }
}

function* getUserConfigs() {
  try {
    const response: { data: IUserConfig } = yield call(
      appServices.getUserConfigs
    );
    yield put(appActions.getUserConfigsSuccess(response.data));
  } catch (error) {
    return;
  }
}

export default function* appSaga() {
  yield takeLatest(appActions.getListCurrencyRequest.type, getListCurrency);
  yield takeLatest(appActions.getListCategoryRequest.type, getListCategory);
  yield takeLatest(appActions.getUserConfigsRequest.type, getUserConfigs);
}

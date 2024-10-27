import { call, put, takeLatest } from "redux-saga/effects";
import { userActions } from "./userSlice";
import { shippingAddressServices } from "@/service/shippingAddressServices";
import { IShippingAddressRequestResponse } from "@/interfaces/shippingAddress";
import { shippingAddressAdapter } from "@/helpers/adapters/ShippingAdapter";
import {
  IInfoWithdrawToday,
  IMyNFT,
  IMySponsor,
  IUserInfo,
} from "@/interfaces/user";
import { userServices } from "@/service/userService";

function* getUserInfo() {
  try {
    const response: { data: { data: IUserInfo } } = yield call(
      userServices.getUserInfo
    );
    yield put(userActions.getUserInfoSuccess(response?.data?.data));
  } catch (error) {
    return;
  }
}

function* getInfoMySponsor() {
  try {
    const response: { data: { data: IMySponsor } } = yield call(
      userServices.getMySponsor
    );
    yield put(userActions.getInfoMySponsorSuccess(response?.data?.data));
  } catch (error) {
    return;
  }
}

function* getUserShippingAddress() {
  try {
    const [response, error] = (yield call(
      shippingAddressServices.getShippingAddressesList
    )) as [{ data: IShippingAddressRequestResponse[] }, Error];

    if (error) {
      throw error;
    }
    yield put(
      userActions.getUserShippingAddressSuccess(
        response.data.map(
          shippingAddressAdapter.convertShipAddressListResponseToShipAddress
        )
      )
    );
  } catch (error) {
    return;
  }
}

function* getMyNFTInfo() {
  try {
    const res: {
      data: {
        data: any;
      };
    } = yield call(userServices.getInfoMyNFT);
    yield put(userActions.getMyNftSuccess(res?.data?.data.nft));
  } catch (error) {
    return;
  }
}

function* getInfoWithdrawToDay() {
  try {
    const res: { data: { data: IInfoWithdrawToday } } = yield call(
      userServices.getInfoWithdrawToDay
    );
    yield put(userActions.getInfoWithdrawToDaySuccess(res?.data?.data));
  } catch (error) {
    return;
  }
}

export default function* userSaga() {
  yield takeLatest(userActions.getUserInfoRequest.type, getUserInfo);
  yield takeLatest(userActions.getInfoMySponsorRequest.type, getInfoMySponsor);
  yield takeLatest(userActions.getMyNftRequest.type, getMyNFTInfo);
  yield takeLatest(
    userActions.getInfoWithdrawToDayRequest.type,
    getInfoWithdrawToDay
  );
  yield takeLatest(
    userActions.getUserShippingRequest.type,
    getUserShippingAddress
  );
}

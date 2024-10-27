import { IPriceNFT } from "@/interfaces/marketplace";
import { marketServices } from "@/service/marketplaceService";
import { call, put, takeLatest } from "redux-saga/effects";
import { marketplaceAction } from "./marketplaceSlice";

function* getNFTPrices() {
  try {
    const res: { data: { data: IPriceNFT[] } } = yield call(
      marketServices.getPricesNFT
    );
    yield put(marketplaceAction.getNFTPricesSuccess(res.data.data));
  } catch (error) {
    return;
  }
}

export default function* marketplaceSaga() {
  yield takeLatest(marketplaceAction.getNFTPricesRequest.type, getNFTPrices);
}

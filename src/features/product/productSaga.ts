import { IResponseArray } from "@/interfaces/common";
import { IReviewProduct } from "@/interfaces/product";
import { productService } from "@/service/productService";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { IConditionReviews, productAction } from "./productSlice";

function* getReviews(action: PayloadAction<IConditionReviews>) {
  const { payload: query } = action;
  try {
    const res: { data: IResponseArray<IReviewProduct> } = yield call(
      productService.getReviews,
      query
    );
    yield put(productAction.getReviewsSuccess(res.data));
  } catch (error) {
    return;
  }
}

export default function* productSaga() {
  yield takeLatest(productAction.getReviewsRequest.type, getReviews);
}

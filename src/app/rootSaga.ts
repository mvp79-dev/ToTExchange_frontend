import { all } from "redux-saga/effects";
import userSaga from "../features/user/userSaga";
import appSaga from "@/features/app/appSaga";
import orderSaga from "@/features/order/orderSaga";
import cartSaga from "@/features/cart/cartSaga";
import marketplaceSaga from "@/features/marketplace/marketplaceSaga";
import alertSaga from "@/features/alert/alertSaga";
import productSaga from "@/features/product/productSaga";

export default function* rootSaga() {
  yield all([
    appSaga(),
    userSaga(),
    cartSaga(),
    orderSaga(),
    marketplaceSaga(),
    alertSaga(),
    productSaga(),
  ]);
}

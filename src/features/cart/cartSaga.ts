import { cartServices } from "@/service/cartServices";
import { call, put, takeLatest } from "redux-saga/effects";
import { cartAction } from "./cartSlice";
import { IProductDetails, IProductItem } from "@/interfaces/product";

export interface ICartItem {
  id: number;
  cartId: number;
  productItem: IProductItemWithDetails;
  productItemId: number;
  price: number;
  quantity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  valueSub?: string;
}

export interface IProductItemWithDetails extends IProductItem {
  product: IProductDetails;
}

function* getListProductsInCart() {
  try {
    const response: { data: { data: ICartItem[] } } = yield call(
      cartServices.getListProductInCart
    );
    yield put(cartAction.getCartSuccess(response?.data?.data));
  } catch (error) {
    return;
  }
}

export default function* cartSaga() {
  yield takeLatest(cartAction.getCartInfoRequest.type, getListProductsInCart);
}

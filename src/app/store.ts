import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";
import userReducer from "../features/user/userSlice";
import appReducer from "../features/app/appSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";
import marketplaceReducer from "../features/marketplace/marketplaceSlice";
import alertReducer from "../features/alert/alertSlice";
import productReducer from "../features/product/productSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderReducer,
    marketplace: marketplaceReducer,
    alert: alertReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
export default store;

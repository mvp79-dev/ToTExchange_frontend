import { TRootState } from "@/app/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICartItem } from "./cartSaga";
import { takeDecimalNumber } from "@/app/common/helper";

interface IInitialState {
  carts: ICartItem[];
  loading: boolean;
  totalPrice: number;
}

const initialState: IInitialState = {
  carts: [],
  loading: false,
  totalPrice: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCartInfoRequest: () => {},
    getCartSuccess: (state, actions: PayloadAction<ICartItem[]>) => {
      state.carts = actions.payload;
      state.totalPrice = actions.payload.reduce((accumulator, item) => {
        return takeDecimalNumber(
          accumulator + item.quantity * item.productItem.price,
          4
        );
      }, 0);
    },
    clearCart: (state) => {
      state.carts = [];
    },
    updateCartItemQuantity: (
      state,
      payload: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const quantity = payload.payload.quantity;
      if (quantity === 0) {
        return;
      }

      const cartItem = state.carts.find(
        (item) => item.id === payload.payload.id
      );

      if (!cartItem) {
        return;
      }

      cartItem.quantity = quantity;
      state.totalPrice = state.carts.reduce((accumulator, item) => {
        return takeDecimalNumber(
          accumulator + item.quantity * item.productItem.price,
          4
        );
      }, 0);
    },
  },
});

export const cartAction = cartSlice.actions;

export const cartSelect = (state: TRootState) => state.cart;
export default cartSlice.reducer;

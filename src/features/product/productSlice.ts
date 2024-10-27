import { TRootState } from "@/app/store";
import { IQuery, IResponseArray } from "@/interfaces/common";
import { IReviewProduct } from "@/interfaces/product";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IConditionReviews extends IQuery {
  productId?: number;
}

export const defaultConditionReview: IConditionReviews = {
  page: 1,
  size: 4,
};
interface IInitialState {
  reviews: {
    data: IReviewProduct[];
    totalPages?: number;
    totalItems?: number;
    condition: IConditionReviews;
  };
}

const initialState: IInitialState = {
  reviews: {
    data: [],
    condition: {
      ...defaultConditionReview,
      productId: 0,
    },
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getReviewsRequest: (state, action: PayloadAction<IConditionReviews>) => {},
    getReviewsSuccess: (
      state,
      actions: PayloadAction<IResponseArray<IReviewProduct>>
    ) => {
      state.reviews.data = actions.payload.data;
      state.reviews.totalPages = actions.payload.meta.totalPages;
      state.reviews.totalItems = actions.payload.meta.count;
    },
    updateConditionReviews: (
      state,
      action: PayloadAction<IConditionReviews>
    ) => {
      state.reviews.condition = action.payload;
    },
    resetConditionReviews: (state) => {
      state.reviews.condition = defaultConditionReview;
    },
  },
});

export const productAction = productSlice.actions;

export const productSelect = (state: TRootState) => state.product;

export default productSlice.reducer;

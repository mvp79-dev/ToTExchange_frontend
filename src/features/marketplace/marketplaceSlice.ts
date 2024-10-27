import { IPriceNFT } from "@/interfaces/marketplace";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  pricesNFT: IPriceNFT[];
}

const initialState: IInitialState = {
  pricesNFT: [],
};

export const MarketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    getNFTPricesRequest: () => {},
    getNFTPricesSuccess: (state, actions: PayloadAction<IPriceNFT[]>) => {
      state.pricesNFT = actions.payload;
    },
  },
});

export const marketplaceAction = MarketplaceSlice.actions;

export default MarketplaceSlice.reducer;

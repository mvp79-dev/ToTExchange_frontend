export enum EKeyPriceNFT {
  nft_price = "nft_price",
  upgrade_nft_price = "upgrade_nft_price",
  upgrade_nft_price_by_year = "upgrade_nft_price_by_year",
  upgrade_nft_price_by_six_month = "upgrade_nft_price_by_six_month",
  nft_price_by_six_month = "nft_price_by_six_month",
  nft_price_by_year = "nft_price_by_year",
}

export interface IPriceNFT {
  key: EKeyPriceNFT;
  value: string;
}

export enum ETypeOptionNFT {
  buy = "buy",
  upgrade = "upgrade",
}

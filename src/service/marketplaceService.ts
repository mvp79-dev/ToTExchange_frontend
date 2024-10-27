import request from "./request";

interface IInputBuyNFT {
  walletAddress?: string;
  package_type: EPackageType;
  autoRenew?: boolean;
}

export enum EPackageType {
  by_month = "by_month",
  by_year = "by_year",
  by_6months = "by_six_month",
}

export enum EBuyNftStatus {
  INITIALIZED = "initialized",
  MINTING = "minting",
  SUCCESS = "success",
}

class MarketplaceServices {
  async buyNFT(body: IInputBuyNFT) {
    try {
      const res = await request.post("/nfts/buy", body);
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }
  async upgradeNFT(body: IInputBuyNFT) {
    try {
      const res = await request.put("/nfts/upgrade", body);
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }
  async renewNFT(body: IInputBuyNFT) {
    try {
      const res = await request.post("/nfts/re-new", body);
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }
  async toggleRenewalNFT() {
    try {
      const res = await request.post("/users/toggle-auto-renew-nft");
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateAutoRenewNft(body: { autoUpgrade: boolean; autoRenew: boolean }) {
    try {
      const res = await request.put("/nfts/toggle-auto-renew", body);
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getPricesNFT() {
    const res = await request.get("/nfts/get-price");
    return res;
  }
}

export const marketServices = new MarketplaceServices();

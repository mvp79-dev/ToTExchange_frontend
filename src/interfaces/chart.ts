export interface ICommonChart {
  date: Date | string;
}
export interface IRevenueChart extends ICommonChart {
  productRevenueTotalAmount: number;
  nftRevenueTotalAmount: number;
}

export interface ISaleChart extends ICommonChart {
  productSaleTotalAmount: number;
  nftSaleTotalAmount: number;
}

export interface ITotalVolumeChart {
  id: number;
  withdrawTotal: number;
  depositTotal: number;
  onDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITotalVisitorChart {
  id: number;
  onDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  guestVistor: number;
  userVistor: number;
}

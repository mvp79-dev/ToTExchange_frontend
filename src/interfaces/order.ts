import { IProductDetails, IProductItem } from "./product";

export enum EOrderStatus {
  CREATED = 0,
  PROCESSING = 1,
  SHIPPING = 2,
  FULFILLED = 3,
  CANCELED = 4,
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productItem: IProductItemWithDetail;
  productItemId: number;
  quantity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface IProductItemWithDetail extends IProductItem {
  product: IProductDetails;
}

export interface IOrder {
  id: number;
  shippingAddress: string;
  orderCustomId: string;
  status: EOrderStatus;
  totalPrice: number;
  userId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderItem: IOrderItem[];
  user: { email: string };
  shippingUnit: string;
  note?: string;
  shippingFee?: number;
}

export interface IShippingInfo {
  name?: string;
  address?: string;
  street?: string;
  district?: string;
  city?: string;
  country?: string;
  phone?: string;
}

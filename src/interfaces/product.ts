import type { UploadFile } from "antd/es/upload";
import { IUserInfo } from "./user";
import { EPRODUCT_STATUS } from "@/app/constants/products";

export interface ICategory {
  id: number;
  name: string;
  parentId: number;
  product?: IProductDetails[];
}

export interface IProductFilter {
  parentCategory: number[];
  childrenCategory: number[];
  price: { from: number; to: number };
}

export enum EStarRating {}

export interface IProductItem {
  id: number;
  value: string;
  quantity: number;
  price: number;
  imgUrl: string;
  status: EPRODUCT_STATUS;
  cost: number;
}

export interface IProductUrl {
  id: number;
  url: string;
  productId: number;
}

export interface IProductDetails {
  SKU: string;
  category: ICategory;
  categoryId: number;
  description: string;
  id: number;
  information: string;
  name: string;
  status: EPRODUCT_STATUS;
  createAt: Date | string;
  updatedAt: Date | string;
  productItem: IProductItem[];
  productUrl: IProductUrl[];
  rating: IRating[];
  starAverage: number | null;
  price: number;
  describe: string;
  isComposed: boolean;
  quantity?: number;
  tag: string | null;
}

export interface IRating {
  id: number;
  star: number;
  comments: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: number;
  productId: number;
}

export interface IProductListItem {
  id: number;
  salePercentage?: number;
  title: string;
  totalRating: number;
  averageRating: number;
  price: number;
  marked: boolean;
  thumbnail: string;
}

export type TSortKey = "" | "asc" | "desc";

export interface IProductDetailResponse {
  code: number;
  message: string;
  data: IProductDetails;
  status: string;
  meta: object;
}

export interface IProductListResponse {
  code: number;
  message: string;
  data: IProductDetails[];
  status: string;
  meta: { count: number; totalPages: number };
}

export interface IProductItemDetail {
  id: number;
  images: string[];
  name: { [key: string]: string };
  price: number;
  salePercentage?: number;
  summaryDescription: { [key: string]: string };
  sku: string;
  categories: {
    id: number;
    name: { [key: string]: string };
    parentId: number;
  }[];
  categoryId: number;
  tags: string[];
  isComposed: boolean;
  description: { [key: string]: string };
  information: { [key: string]: string };
  rating: {
    id: number;
    username: string;
    avatarUrl: string;
    createdAt: string;
    comment: string;
    rating: number;
  }[];
  relatedProducts: IProductListItem[];
  productItem: IProductItem[];
}

export interface IReviewProduct {
  id: number;
  star: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  user: IUserInfo;
}

export interface IInputReviewProduct {
  star: number;
  comments: string;
  productId: number;
}

export interface IAdminProductListItem {
  id: number;
  SKU: string;
  name: string;
  price: number;
  sold: number;
  status: EPRODUCT_STATUS;
  isComposed: boolean;
  inStock: number;
  starAverage: number;
  productItems: IProductItem[];
  productUrl: IProductUrl[];
}

interface IBaseProductEditForm {
  id?: string;
  vi: {
    name: string;
    description: string;
  };
  en: {
    name: string;
    description: string;
  };
  category: number;
  SKU: string;
  brand: string;
  tags: string;
  uploadedImages?: string[];
  images: UploadFile[];
}

export interface ISingleProductCreationForm extends IBaseProductEditForm {
  subProductId?: string;
  sellPrice: string;
  inStock: string;
  isComposedProduct: false;
}

export interface IComposedProductCreationForm extends IBaseProductEditForm {
  isComposedProduct: true;
  products: {
    id?: string;
    value: string;
    quantity: string;
    price: string;
    cost: string;
    imgUrl: string;
    images: UploadFile[];
  }[];
}

export type TProductCreationForm =
  | IComposedProductCreationForm
  | ISingleProductCreationForm;

export type TProductEditRequestPayload = {
  id?: number | null;
  name: string;
  description: string;
  // information: string;
  imgUrl?: string;
  tag: string;
  describe: string;
  SKU: string;
  categoryId: number;
  imageURL: string[] | undefined;
} & (
  | {
      isComposed: false;
      price: number;
      cost: number;
      quantity: number;
      itemImageUrl: string;
    }
  | {
      isComposed: true;
      item: {
        quantity: number;
        value: string;
        price: number;
        cost: number;
        imgUrl: string;
      }[];
    }
);

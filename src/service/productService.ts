import {
  IProductDetailResponse,
  IProductListResponse,
  TProductEditRequestPayload,
} from "@/interfaces/product";
import { IQuery } from "../interfaces/common";
// eslint-disable-next-line no-redeclare
import Request from "./request";
import { AxiosResponse } from "axios";
import { IConditionReviews } from "@/features/product/productSlice";
import { EPRODUCT_STATUS } from "@/app/constants/products";

class ProductService {
  async projectList(props: IQuery) {
    const { page, size } = props;
    try {
      const res = await Request.get(`/products`, {
        page,
        size,
      });
      return res.data;
    } catch (error) {
      return [null, error];
    }
  }

  async getProductList(
    params:
      | IQuery
      | {
          categoryId?: string;
          created_at: string;
          categoryParentId_in: string;
          categoryId_in: string;
          price_gte: number;
          price_lte: number;
        }
  ): Promise<[IProductListResponse | null, unknown | null]> {
    try {
      const res: AxiosResponse<IProductListResponse> = await Request.get(
        "/products",
        params
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getProductDetail(
    prodId: number
  ): Promise<[IProductDetailResponse | null, unknown | null]> {
    try {
      const res: AxiosResponse<IProductDetailResponse> = await Request.get(
        `/products/${prodId}`
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getReviews(params: IConditionReviews) {
    const res = await Request.get(`/rating/get-rating`, params);
    return res;
  }

  async getAdminProductList(
    params?: IQuery & { status?: 0 | 1 }
  ): Promise<[IProductListResponse | null, unknown | null]> {
    try {
      const res: AxiosResponse<IProductListResponse> = await Request.get(
        "/admin/products",
        params
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async createProduct(
    form: TProductEditRequestPayload
  ): Promise<[IProductListResponse | null, any]> {
    try {
      const res: AxiosResponse<IProductListResponse> = await Request.post(
        "/admin/products",
        form
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateProduct(
    productId: string | number,
    form: TProductEditRequestPayload
  ): Promise<[IProductListResponse | null, any]> {
    try {
      const res: AxiosResponse<IProductListResponse> = await Request.put(
        `/admin/products/${productId}`,
        form
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async getAdminProductDetail(
    productId: number | string
  ): Promise<[IProductDetailResponse | null, unknown | null]> {
    try {
      const res: AxiosResponse<IProductDetailResponse> = await Request.get(
        `/admin/products/${productId}`
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateProductVisibilityStatus(
    productId: number | string,
    status: EPRODUCT_STATUS
  ) {
    try {
      const res: AxiosResponse<IProductDetailResponse> = await Request.put(
        `/admin/products/active/${productId}`,
        { status }
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateSubProductVisibilityStatus(
    productId: number | string,
    status: EPRODUCT_STATUS
  ) {
    try {
      const res: AxiosResponse<IProductDetailResponse> = await Request.put(
        `/admin/productItem/active/${productId}`,
        { status }
      );
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export const productService = new ProductService();

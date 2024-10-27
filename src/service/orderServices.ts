import { AxiosError, AxiosResponse } from "axios";
import { IQuery } from "@/interfaces/common";
import request from "./request";
import { EOrderStatus } from "@/interfaces/order";

class OrderServices {
  async orderProduct(form: {
    cardItemIds: number[];
    shippingAddressId: number;
  }) {
    try {
      const response: AxiosResponse<{
        code: number;
        message: string;
        data: { id: number };
        status: string;
        meta: {};
      }> = await request.post("/orders", form);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  async getListOrders(query: IQuery) {
    const response = await request.get("/orders", query);
    return response?.data;
  }

  async getOrderDetail(orderId: number) {
    try {
      const response = await request.get(`/orders/${orderId}`);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }
  async getAdminOrderList(query: IQuery) {
    const { status, ...params } = query;
    const response = await request.get("/admin/orders", {
      ...params,
      status,
    });
    return response?.data;
  }

  async getAdminDetailOrder(id: number) {
    try {
      const { data } = await request.get(`/admin/orders/${id}`);
      return [data.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }
  async updateAdminDetailOrder(
    form: {
      status: EOrderStatus;
      note: string;
      shippingUnit: string;
    },
    orderId: number
  ) {
    try {
      const response: AxiosResponse<{
        code: number;
        message: string;
        data: { id: number };
        status: string;
        meta: {};
      }> = await request.put(`/admin/orders/${orderId}`, form);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }

  async cancelOrder(orderId: number) {
    try {
      const response = await request.put(`/orders/${orderId}`);
      return [response.data, null];
    } catch (error) {
      return [null, error as AxiosError];
    }
  }
}

export const orderServices = new OrderServices();

import {
  TShippingAddressEditRequest,
  IShippingAddressListResponse,
} from "@/interfaces/shippingAddress";
import request from "./request";
import { AxiosResponse } from "axios";

class ShippingAddressServices {
  async getShippingAddressesList() {
    try {
      const response: AxiosResponse<IShippingAddressListResponse> =
        await request.get("/shipping-address");
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async addShippingAddress(form: TShippingAddressEditRequest) {
    try {
      const response = await request.post("/shipping-address", form);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  }

  async editShippingAddress(
    shippingAddressId: number,
    form: TShippingAddressEditRequest
  ) {
    try {
      const response = await request.put(
        `/shipping-address/${shippingAddressId}`,
        form
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  }
}

export const shippingAddressServices = new ShippingAddressServices();

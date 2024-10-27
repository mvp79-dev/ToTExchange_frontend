import {
  TShippingAddressEditRequest,
  IShippingAddressForm,
  IShippingAddressRequestResponse,
} from "@/interfaces/shippingAddress";

class ShippingAddressAdapter {
  convertShippingFormToEditFormRequest(
    data: IShippingAddressForm
  ): TShippingAddressEditRequest {
    return {
      // address: data.street_1,
      city: data.city,
      phone: data.receiverPhone,
      name: data.receiverName,
      country: data.country,
      district: data.district,
      isDefault: data.isDefault ?? false,
      postCode: data.postalCode,
      street: data.street,
    };
  }

  getFullShippingAddress(address: IShippingAddressForm): string {
    return `${address.street}, ${address.district}, ${address.city}`;
  }

  convertShipAddressListResponseToShipAddress(
    data: IShippingAddressRequestResponse
  ): IShippingAddressForm {
    return {
      id: data.id,
      receiverName: data.name,
      receiverPhone: data.phone,
      street: data.street ?? "",
      // street_1: data.address,
      country: data.country,
      postalCode: data.postCode,
      district: data.district,
      city: data.city,
      isDefault: data.isDefault,
    };
  }
}

export const shippingAddressAdapter = new ShippingAddressAdapter();

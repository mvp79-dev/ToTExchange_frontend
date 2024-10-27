export interface IShippingAddressForm {
  id?: number;
  receiverName: string;
  receiverPhone: string;
  street: string;
  // street_1: string;
  country: string;
  postalCode: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

export interface IShippingAddressRequestResponse {
  id: number;
  phone: string;
  name: string;
  country: string;
  city: string;
  district: string;
  postCode: string;
  street: string | null;
  // address: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type TShippingAddressEditRequest = Omit<
  IShippingAddressRequestResponse,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

export interface IShippingAddressListResponse {
  code: number;
  message: string;
  data: IShippingAddressRequestResponse[];
  status: string;
  meta: object;
}

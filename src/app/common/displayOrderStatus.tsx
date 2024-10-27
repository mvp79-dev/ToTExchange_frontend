import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import { EOrderStatus } from "@/interfaces/order";
import { TFunction } from "i18next";

export const DisplayOrderStatus = (
  status: EOrderStatus,
  t: TFunction<"translation", undefined>
) => {
  switch (status) {
    case EOrderStatus.CREATED:
      return (
        <span style={{ color: "#faad14" }}>
          {orderAdapter.mappingStatusOrder(status, t)}
        </span>
      );
    case EOrderStatus.PROCESSING:
    case EOrderStatus.SHIPPING:
      return (
        <span style={{ color: "#9dca00" }}>
          {orderAdapter.mappingStatusOrder(status, t)}
        </span>
      );
    case EOrderStatus.FULFILLED:
      return (
        <span style={{ color: "#52c41a" }}>
          {orderAdapter.mappingStatusOrder(status, t)}
        </span>
      );
    case EOrderStatus.CANCELED:
      return (
        <span style={{ color: "#f5222d" }}>
          {orderAdapter.mappingStatusOrder(status, t)}
        </span>
      );
    default:
      return (
        <span style={{ color: "#9dca00" }}>
          {orderAdapter.mappingStatusOrder(status, t)}
        </span>
      );
  }
};

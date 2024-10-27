import { roundNumberDecimal } from "@/app/common/number";
import { parseJsonAddress } from "@/app/common/saveParseJSON";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import { ICartItem } from "@/features/cart/cartSaga";
import { EKeyTranslations } from "@/interfaces/common";
import { EOrderStatus, IOrder, IOrderItem } from "@/interfaces/order";
import dayjs from "dayjs";
import { TFunction } from "i18next";

const DEFAULT_FEE = 5;
class OrderAdapter {
  convertCartItemsListToCreateCartRequest(itemsList: ICartItem[]): number[] {
    return itemsList.map((cartItem) => Number(cartItem.id));
  }
  convertOrderViewList(itemsList: IOrder[]) {
    return itemsList.map((item) => {
      return {
        id: item.id,
        key: item.orderCustomId,
        totalItem: item.orderItem.length,
        amount: item.totalPrice,
        status: item.status,
      };
    });
  }
  mappingStatusOrder(
    status: EOrderStatus,
    t: TFunction<"translation", undefined>
  ) {
    switch (status) {
      case EOrderStatus.CANCELED:
        return t("adminOrders.orderStatus.cancelled");
      case EOrderStatus.FULFILLED:
        return t("adminOrders.orderStatus.fulfilled");
      case EOrderStatus.PROCESSING:
        return t("adminOrders.orderStatus.accessing");
      case EOrderStatus.CREATED:
        return t("adminOrders.orderStatus.created");
      case EOrderStatus.SHIPPING:
        return t("adminOrders.orderStatus.shipping");
      default:
        return "";
    }
  }

  convertOrderItemFromApi(orderItem: IOrderItem, language: EKeyTranslations) {
    const { productItem, id, quantity } = orderItem;
    // const salePrice = (productItem.price * productItem.cost) / 100;
    return {
      key: id,
      id: id,
      productItem: {
        url: productItem.imgUrl,
        title:
          transformLanguageData(language, productItem.product.name) +
          (productItem.value || ""),
      },
      quantity: quantity,
      totalPrice: roundNumberDecimal(quantity * productItem.price, 4),
      price: productItem.price,
    };
  }
  convertAdminOrderList(
    itemsList: IOrder[],
    t: TFunction<"translation", undefined>
  ) {
    return itemsList.map((item, index) => {
      const userShippingInfo = parseJsonAddress(
        item?.shippingAddress as string
      );
      return {
        id: item.id,
        index: index,
        orderCustomId: item.orderCustomId,
        createdAt: dayjs(item.createdAt).format("h:mm:ss A MM/DD/YYYY"),
        total: item.totalPrice,
        status: item.status,
        customer: userShippingInfo?.name || "",
        fee: DEFAULT_FEE,
        shippingUnit: item.shippingUnit || "",
      };
    });
  }

  renderListStatusOption(t: TFunction<"translation", undefined>) {
    return [
      // {
      //   label: t("adminOrders.orderStatus.created"),
      //   value: EOrderStatus.CREATED.toString(),
      // },
      {
        label: t("adminOrders.orderStatus.accessing"),
        value: EOrderStatus.PROCESSING.toString(),
      },
      {
        label: t("adminOrders.orderStatus.fulfilled"),
        value: EOrderStatus.FULFILLED.toString(),
      },
      {
        label: t("adminOrders.orderStatus.shipping"),
        value: EOrderStatus.SHIPPING.toString(),
      },
      {
        label: t("adminOrders.orderStatus.cancelled"),
        value: EOrderStatus.CANCELED.toString(),
      },
    ];
  }
}

export const orderAdapter = new OrderAdapter();

import { transformLanguageData } from "@/app/common/transformDataResponse";
import { ICartItem } from "@/features/user/cartSaga";
import { EKeyTranslations } from "@/interfaces/common";

export interface IDataCartTable {
  key: number;
  id: number;
  productItem: {
    url: string;
    title: string;
    value?: string;
  };
  price: number;
  quantity: number;
  totalPrice: number;
  quantityLimit: number;
}

class CartAdapter {
  mappingDataCartItem(item: ICartItem) {
    return {
      id: item.id,
      quantity: item.quantity,
      productItemId: item.productItemId,
      price: item.productItem.price,
      imgUrl: item.productItem.imgUrl,
      name: item.productItem.product.name,
      valueSub: item.productItem.value,
      quantityLimit: item.productItem.quantity,
    };
  }
  mappingDataCartTable(item: ICartItem): IDataCartTable {
    return {
      key: item?.id,
      id: item.productItemId,
      productItem: {
        url: item.productItem.imgUrl,
        title: item.productItem.product.name,
        value: item.productItem.value,
      },
      price: item.productItem.price,
      quantity: item.quantity,
      totalPrice: item.productItem.price * item.quantity,
      quantityLimit: item.productItem.quantity,
    };
  }
}

export const cartDataAdapter = new CartAdapter();

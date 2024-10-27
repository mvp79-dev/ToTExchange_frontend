import store from "@/app/store";
import { cartAction } from "@/features/cart/cartSlice";
import { userServices } from "@/service/userService";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import ModalWarningQuantityLimitProduct from "../Modal/ModalWarningQuantityLimitProduct";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";
import ModalConfirmDelCart from "../ModalConfirmDelCart";
import { cartServices } from "@/service/cartServices";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import classNames from "classnames";
import { EKeyTranslations } from "@/interfaces/common";

type TDrawerCartItem = {
  id: number;
  price: number;
  quantity: number;
  imgUrl: string;
  productItemId: number;
  name: string;
  quantityLimit: number;
  valueSub: string;
};

export default function DrawerCartItem({
  id,
  price,
  quantity,
  imgUrl,
  productItemId,
  name,
  quantityLimit,
  valueSub,
}: TDrawerCartItem) {
  const { t, i18n } = useTranslation();

  const [openModalWarning, setOpenModalWarning] = useState<boolean>(false);

  const [openModalConfirmDel, setOpenModalConfirmDel] =
    useState<boolean>(false);

  const removeToCart = useCallback(async () => {
    const [res, error] = await cartServices.removeCartItem(id);
    if (error) {
      toast.error(error?.data?.message);
    } else {
      store.dispatch(cartAction.getCartInfoRequest());
      toast.success(t("cart.messageRemoveCartSuccess"));
    }
    setOpenModalConfirmDel(false);
  }, [id, t]);

  const handleAddToCart = useCallback(
    async (value: number) => {
      const [res, error] = await userServices.updateItemToCart(Number(id), {
        quantity: value,
      });
      if (error) {
        toast.error(error?.data?.message);
      } else {
        store.dispatch(cartAction.getCartInfoRequest());
      }
    },
    [id]
  );

  async function addMoreBuyQuantity() {
    if (quantity + 1 > quantityLimit) {
      setOpenModalWarning(true);
    } else {
      setOpenModalWarning(false);
      await handleAddToCart(quantity + 1);
    }
  }

  async function reduceBuyQuantity() {
    if (quantity === 1) return;

    await handleAddToCart(quantity - 1);
  }

  return (
    <div className={style.cartItem}>
      <div className={style.cartItemInfo}>
        <div className={style.cartItemImg}>
          <img src={imgUrl} alt="product" />
        </div>
        <div className={style.cartItemBox}>
          <div className={style.cartItemHeader}>
            <div>
              {transformLanguageData(i18n.language as EKeyTranslations, name)}{" "}
              {valueSub}
            </div>
            <DeleteOutlined onClick={() => setOpenModalConfirmDel(true)} />
          </div>
          <div className={style.cartItemAction}>
            <div
              className={classNames(quantity === 1 && style.btnDisable)}
              onClick={reduceBuyQuantity}
            >
              <MinusOutlined />
            </div>
            <div>{quantity}</div>
            <div onClick={addMoreBuyQuantity}>
              <PlusOutlined />
            </div>
          </div>
          <div className={style.cartItemTotalPrice}>
            <div>
              {quantity} x <span>${price}</span>
            </div>
            {quantityLimit <= 10 && (
              <div className={style.cartItemTotalPrice__warning}>
                {t("drawerCartItem.textOnly")} {quantityLimit}{" "}
                {t("drawerCartItem.textProduct")}
              </div>
            )}
          </div>
        </div>
      </div>
      {openModalWarning && (
        <ModalWarningQuantityLimitProduct
          open={openModalWarning}
          onClose={() => setOpenModalWarning(false)}
          value={quantityLimit}
        />
      )}
      {openModalConfirmDel && (
        <ModalConfirmDelCart
          open={openModalConfirmDel}
          onClose={() => setOpenModalConfirmDel(false)}
          onClick={() => removeToCart()}
        />
      )}
    </div>
  );
}

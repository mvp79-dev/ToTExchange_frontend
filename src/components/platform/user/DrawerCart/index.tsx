import { Button } from "antd";
import HPDrawer from "../../../common/HPDrawer";
import DrawerCartItem from "./DrawerCartItem";
import style from "./style.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useAppSelector } from "@/app/hooks";
import { cartDataAdapter } from "@/helpers/adapters/CartAdapter";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function DrawerCart({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { carts, totalPrice } = useAppSelector((state) => state.cart);
  const cartsLength = carts.length;
  const { t } = useTranslation();
  return (
    <HPDrawer
      open={open}
      onClose={onClose}
      title={`${t("cart.Shopping Cart")} (${cartsLength})`}
    >
      <div className={style.drawerCart}>
        <div>
          {carts.map((item, index) => {
            const mappingData = cartDataAdapter.mappingDataCartItem(item);
            return <DrawerCartItem {...mappingData} key={item.id} />;
          })}
        </div>
        <div className={style.footer}>
          <div className={style.subtotal}>
            <div>{t("drawerCart.textSubtotal")}:</div>
            <span>${totalPrice}</span>
          </div>
          <div className={style.action}>
            <Button
              onClick={() => navigate(ERoutePath.MY_CART)}
              className={style.btnViewCart}
            >
              <span>{t("drawerCart.btnViewCart")}</span>
            </Button>
            <Button
              className={classNames("ant-btn-custom")}
              onClick={() => navigate(ERoutePath.CART_CHECKOUT)}
            >
              <span>{t("drawerCart.btnCheckout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </HPDrawer>
  );
}

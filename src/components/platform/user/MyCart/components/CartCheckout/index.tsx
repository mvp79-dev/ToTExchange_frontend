import { EKeyTranslations, IColumn } from "@/interfaces/common";
import {
  DeleteOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Table } from "antd";
import classNames from "classnames";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { takeDecimalNumber } from "@/app/common/helper";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import store from "@/app/store";
import { cartAction } from "@/features/cart/cartSlice";
import {
  IDataCartTable,
  cartDataAdapter,
} from "@/helpers/adapters/CartAdapter";
import { userServices } from "@/service/userService";
import { toast } from "react-toastify";
import ModalWarningQuantityLimitProduct from "../../../Modal/ModalWarningQuantityLimitProduct";
import styles from "./style.module.scss";
import { cartServices } from "@/service/cartServices";
import ModalConfirmDelCart from "../../../ModalConfirmDelCart";
import { transformLanguageData } from "@/app/common/transformDataResponse";
import _debounce from "lodash/debounce";
import DrawerCartItem from "../../../DrawerCart/DrawerCartItem";

interface IProps {
  onCheckout: () => void;
}

function CartCheckout({ onCheckout }: IProps) {
  const { t, i18n } = useTranslation();
  const [openModalWarning, setOpenModalWarning] = useState<boolean>(false);
  const [openModalConfirmDel, setOpenModalConfirmDel] =
    useState<boolean>(false);
  const [selectedItemDelete, setSelectedItemDeleted] = useState<number>(0);

  const [quantityLimitState, setQuantityLimitState] = useState<number>(0);

  const balance = useAppSelector((state) => state.user.user?.balance);
  const { carts, totalPrice } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const cartQuantities = carts.length;

  const dataSource = carts.map((cart, index) =>
    cartDataAdapter.mappingDataCartTable(cart)
  );

  const shippingFree = 0;

  const totalPayment = totalPrice + shippingFree;

  const removeToCart = async (cartItemId: number) => {
    const [res, error] = await cartServices.removeCartItem(cartItemId);
    if (error) {
      toast.error(error?.data?.message);
    } else {
      store.dispatch(cartAction.getCartInfoRequest());
      toast.success(t("cart.messageRemoveCartSuccess"));
    }
    setOpenModalConfirmDel(false);
    setSelectedItemDeleted(0);
  };

  const debouncedCartUpdate = useMemo(() => {
    return _debounce(async (id: number, quantity: number) => {
      const [res, error] = await userServices.updateItemToCart(Number(id), {
        quantity,
      });
      if (error) {
        toast.error(error?.data?.message);
      } else {
        store.dispatch(cartAction.getCartInfoRequest());
      }
    }, 1000);
  }, []);

  const updateCartItemQuantity = (
    cartItem: IDataCartTable,
    quantity: number
  ) => {
    dispatch(cartAction.updateCartItemQuantity({ id: cartItem.key, quantity }));
    debouncedCartUpdate(Number(cartItem.key), quantity);
  };

  const columns: Array<IColumn> = [
    {
      title: t("cart.productItems"),
      dataIndex: "productItem",
      key: "productItem",
      width: "%",
      render: (productItem: { title: string; url: string }) => {
        return (
          <div className={styles.productInfo}>
            <img src={productItem.url} alt="img product" />
            <span>
              {transformLanguageData(
                i18n.language as EKeyTranslations,
                productItem.title
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: t("cart.unitPrice"),
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price: number) => <div className={styles.price}>${price}</div>,
    },
    {
      title: t("cart.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity: number, record: IDataCartTable) => {
        async function addMoreBuyQuantity() {
          setQuantityLimitState(record.quantityLimit);
          if (quantity + 1 > record.quantityLimit) {
            setOpenModalWarning(true);
          } else {
            setOpenModalWarning(false);
          }
          updateCartItemQuantity(record, quantity + 1);
        }
        async function reduceBuyQuantity() {
          if (quantity === 1) return;
          updateCartItemQuantity(record, quantity - 1);
        }

        return (
          <div className={styles.quantity}>
            <div
              onClick={reduceBuyQuantity}
              className={classNames(quantity === 1 && styles.btnDisable)}
            >
              <MinusOutlined />
            </div>
            <div className={styles["table__quantity"]}>{quantity}</div>
            <div onClick={addMoreBuyQuantity}>
              <PlusOutlined />
            </div>
          </div>
        );
      },
    },
    {
      title: t("cart.totalPrice"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice: number) => (
        <div className={styles.totalPrice}>
          ${takeDecimalNumber(totalPrice)}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "action",
      align: "center",
      render: (key: number) => (
        <DeleteOutlined
          onClick={() => {
            setOpenModalConfirmDel(true);
            setSelectedItemDeleted(key);
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles["checkout__container"]}>
      <div className={styles.myCart}>
        <span>{t("cart.myCart", { count: cartQuantities })}</span>
        <div className={styles.table}>
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        </div>
      </div>
      <div className={styles.myCartMobile}>
        <div className={styles.myCartMobile__title}>
          {t("cart.myCart", { count: cartQuantities })}
        </div>
        <div>
          {carts.map((item, index) => {
            const mappingData = cartDataAdapter.mappingDataCartItem(item);
            return <DrawerCartItem {...mappingData} key={item.id} />;
          })}
        </div>
      </div>
      <div className={styles.paymentSummary}>
        <div className={styles.title}>{t("cart.paymentSummary")}</div>
        <div className={styles.paymentSummaryItem}>
          <div className={styles.label}>{t("cart.orderSummary")}</div>
          <div className={styles.value}>${totalPrice}</div>
        </div>
        <div className={styles.paymentSummaryItem}>
          <div className={styles.label}>{t("cart.shippingFee")}</div>
          <div className={styles.value}>{"N/A"}</div>
        </div>
        <div className={styles.paymentSummaryItem}>
          <div className={styles.label}>{t("cart.promoCode")}</div>
          <div className={styles.valueCode}>
            <span> Select </span>
            <DownOutlined className={styles["promoteCode__icon"]} />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.paymentSummaryItem}>
          <div className={styles.label}>{t("cart.Total")}</div>
          <div className={classNames(styles.value, styles.highlightText)}>
            ${totalPayment}
          </div>
        </div>
        <Button
          className={styles.btnCheckout}
          disabled={carts.length === 0}
          onClick={onCheckout}
        >
          {(balance ?? 0) < totalPrice
            ? t("cart.Insufficient Balance")
            : t("cart.Checkout")}
        </Button>
      </div>
      {openModalWarning && (
        <ModalWarningQuantityLimitProduct
          open={openModalWarning}
          onClose={() => setOpenModalWarning(false)}
          value={quantityLimitState}
        />
      )}
      {openModalConfirmDel && (
        <ModalConfirmDelCart
          open={openModalConfirmDel}
          onClose={() => setOpenModalConfirmDel(false)}
          onClick={() => removeToCart(selectedItemDelete)}
        />
      )}
    </div>
  );
}

export default CartCheckout;

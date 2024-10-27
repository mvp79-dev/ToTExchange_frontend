import { useMemo, useState, useRef } from "react";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { EKeyTranslations, IColumn } from "@/interfaces/common";
import {
  Button,
  Collapse,
  CollapseProps,
  Divider,
  FormInstance,
  Radio,
  Table,
} from "antd";
import { useAppSelector } from "@/app/hooks";
import {
  IDataCartTable,
  cartDataAdapter,
} from "@/helpers/adapters/CartAdapter";
import { takeDecimalNumber } from "@/app/common/helper";
import classNames from "classnames";
import { ECartPaymentMethod } from "@/app/constants/cart";
import CartIconURL from "@/assets/images/card.png";
import InternalUserPoint from "../InternalPoint";
import VisaIconURL from "@/assets/images/visa.png";
import MasterCartIconURL from "@/assets/images/master.png";
import MaestroCartIconURL from "@/assets/images/maestro.png";
import JCBCartIconURL from "@/assets/images/jcb.png";
import CartForm from "../CardForm";
import { ICheckoutCardForm } from "@/interfaces/cart";
import { shippingAddressAdapter } from "@/helpers/adapters/ShippingAdapter";
import { transformLanguageData } from "@/app/common/transformDataResponse";

function getCartMethodTitle(title: string, description: string) {
  return (
    <div
      className={
        styles["cart-payment__cart-info__payment-method__option-title"]
      }
    >
      <img src={CartIconURL} alt="" width={32} height={32} />
      <div>
        <p
          className={
            styles[
              "cart-payment__cart-info__payment-method__option-title__title"
            ]
          }
        >
          {title}
        </p>
        <p
          className={
            styles[
              "cart-payment__cart-info__payment-method__option-title__desc"
            ]
          }
        >
          {description}
        </p>
      </div>
    </div>
  );
}

interface IProps {
  selectedShipAddress: number;
  onChangeShippingAddress: () => void;
  onSubmitPayment: (form?: ICheckoutCardForm) => void;
}

function CartPayment({
  selectedShipAddress,
  onChangeShippingAddress,
  onSubmitPayment,
}: IProps) {
  const { t, i18n } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<ECartPaymentMethod>(ECartPaymentMethod.INTERNAL_POINT);

  const carts = useAppSelector((state) => state.cart.carts);
  const totalPrice = useAppSelector((state) => state.cart.totalPrice);
  const addressList = useAppSelector((state) => state.user.shippingAddress);
  const balance = useAppSelector((state) => state.user.user?.balance);

  // const shippingFee = 10;
  // const discount = 5;

  const totalPayment = totalPrice;

  const rfCardForm = useRef<{ form: FormInstance<ICheckoutCardForm> }>(null);

  const cartItems = useMemo(() => {
    return carts.map((cart) => cartDataAdapter.mappingDataCartTable(cart));
  }, [carts]);
  console.log("cartItems", cartItems);

  const paymentMethodItems = useMemo(() => {
    const items: CollapseProps["items"] = [
      {
        key: ECartPaymentMethod.INTERNAL_POINT,
        label: getCartMethodTitle(
          t("cart.Internal Balance"),
          t("cart.Change the current balance")
        ),
        children: <InternalUserPoint />,
      },
      // {
      //   key: ECartPaymentMethod.CASH_ON_DELIVERY,
      //   label: getCartMethodTitle(
      //     t("cart.Cash On Delivery"),
      //     t("cart.Pay when you receive")
      //   ),
      //   children: null,
      // },
      // {
      //   key: ECartPaymentMethod.CARD,
      //   label: getCartMethodTitle(
      //     t("cart.Credit_Debit_Card"),
      //     t("cart.Transaction fee may apply")
      //   ),
      //   children: <CartForm ref={rfCardForm} />,
      //   extra: (
      //     <div
      //       className={
      //         styles[
      //           "cart-payment__cart-info__payment-method__option-title__cards-list"
      //         ]
      //       }
      //     >
      //       <img src={VisaIconURL} width={32} height={32} />
      //       <img src={MasterCartIconURL} width={32} height={32} />
      //       <img src={JCBCartIconURL} width={32} height={32} />
      //       <img src={MaestroCartIconURL} width={32} height={32} />
      //     </div>
      //   ),
      // },
    ];

    return items;
  }, [t]);

  const columns: Array<IColumn> = useMemo(
    () => [
      {
        title: t("cart.Product Items"),
        dataIndex: "productItem",
        key: "productItem",
        width: "50%",
        render: (productItem: {
          title: string;
          url: string;
          value: string;
        }) => (
          <div className={styles.productInfo}>
            <img src={productItem.url} alt="img product" />
            <span>
              {transformLanguageData(
                i18n.language as EKeyTranslations,
                productItem.title
              )}{" "}
              {productItem.value}
            </span>
          </div>
        ),
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
        render: (quantity: number) => <div>{quantity}</div>,
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
    ],
    [i18n.language, t]
  );

  const deliveryAddress = useMemo(() => {
    if (addressList.length === 0) {
      return {
        name: "",
        phoneNumber: "",
        address: "",
      };
    }

    const activeAddress =
      addressList.find((address) => address.id === selectedShipAddress) ??
      addressList[0];

    return {
      name: activeAddress?.receiverName,
      phoneNumber: activeAddress?.receiverPhone,
      address: shippingAddressAdapter.getFullShippingAddress(activeAddress),
    };
  }, [addressList, selectedShipAddress]);

  function changePaymentMethod(selectedKeys: string | string[]) {
    let selectMethod: ECartPaymentMethod = selectedPaymentMethod;

    if (Array.isArray(selectedKeys) && selectedKeys.length) {
      selectMethod = selectedKeys[0] as ECartPaymentMethod;
    } else if (selectedKeys.length) {
      selectMethod = selectedKeys as ECartPaymentMethod;
    }

    setSelectedPaymentMethod(selectMethod);

    if (
      selectedPaymentMethod === ECartPaymentMethod.CARD &&
      selectMethod !== selectedPaymentMethod
    ) {
      rfCardForm.current?.form.resetFields();
    }
  }

  async function proceedToCheckoutHandler() {
    if (carts.length === 0 || (balance ?? 0) < totalPrice) {
      return;
    }

    let cardForm;

    if (selectedPaymentMethod === ECartPaymentMethod.CARD) {
      try {
        const result = await rfCardForm.current!.form.validateFields();
        cardForm = result;
      } catch (error) {
        return;
      }
    }

    onSubmitPayment(cardForm);
  }

  return (
    <div className={styles["cart-payment"]}>
      <div className={styles["cart-payment__container"]}>
        <section className={styles["cart-payment__cart-info"]}>
          <div className={styles["cart-payment__cart-info__container"]}>
            <h4 className={styles["cart-payment__cart-info__title"]}>
              {t("cart.Your Cart")}
            </h4>
            <div className={styles["cart-payment__cart-info__table"]}>
              <Table
                columns={columns}
                dataSource={cartItems}
                pagination={false}
              />
            </div>
            {cartItems.map((item: IDataCartTable, index) => {
              return (
                <div
                  key={index}
                  className={styles["cart-payment__cart-info__tableMobile"]}
                >
                  <div className={styles.columnInfo}>
                    <img src={item.productItem.url} />
                    <p>
                      {transformLanguageData(
                        i18n.language as EKeyTranslations,
                        item.productItem.title
                      )}
                      {item.productItem.value}
                    </p>
                  </div>
                  <div className={styles.columnBottom}>
                    <span>${item.price}</span>
                    <span>{item.quantity}</span>
                    <span className={styles.columnBottom__totalPrice}>
                      ${item.totalPrice}
                    </span>
                  </div>
                  <div className={styles.columnLine}></div>
                </div>
              );
            })}
          </div>

          <div className={styles["cart-payment__cart-info__payment-method"]}>
            <h5>{t("cart.Select Payment Method")}</h5>
            <Collapse
              accordion
              bordered={false}
              items={paymentMethodItems}
              activeKey={selectedPaymentMethod}
              ghost
              className={
                styles["cart-payment__cart-info__payment-method__option-list"]
              }
              expandIcon={(panelProps) => (
                <Radio checked={panelProps.isActive} />
              )}
              onChange={changePaymentMethod}
            />
          </div>
        </section>
        <section className={styles["cart-payment__payment-info"]}>
          <div className={styles["delivery-address"]}>
            <div className={styles["delivery-address__title"]}>
              <h5>{t("cart.Delivery Addess")}</h5>
              <Button type="text" onClick={onChangeShippingAddress}>
                {t("cart.Change")}
              </Button>
            </div>
            <p className={styles["delivery-address__contact"]}>
              <span>{deliveryAddress.name}</span>
              <Divider type="vertical" />
              <span>{deliveryAddress.phoneNumber}</span>
            </p>
            <p className={styles["delivery-address__address"]}>
              {deliveryAddress.address}
            </p>
          </div>

          <div className={styles["payment-summary"]}>
            <div className={styles["payment-summary__container"]}>
              <h5 className={styles["payment-summary__title"]}>
                {t("cart.paymentSummary")}
              </h5>
              <p className={styles["payment-summary__summary-item"]}>
                <div className={styles.label}>{t("cart.orderSummary")}</div>
                <div className={styles.value}>${totalPrice}</div>
              </p>
              <p className={styles["payment-summary__summary-item"]}>
                <div className={styles.label}>{t("cart.shippingFee")}</div>
                <div className={styles.value}>TBA</div>
              </p>
              {/* <p
                className={styles["payment-summary__summary-item"]}
                style={{ display: "none !important" }}
              >
                <div className={styles.label}>{t("cart.Discount")}</div>
                <div className={classNames(styles.value, styles.discount)}>
                  -${discount}
                </div>
              </p> */}

              <Divider />
              <p
                className={classNames(
                  styles["payment-summary__summary-item"],
                  styles["total"]
                )}
              >
                <div className={styles.label}>{t("cart.Total")}</div>
                <div className={classNames(styles.value, styles.highlightText)}>
                  ${totalPayment}
                </div>
              </p>
            </div>
            <Button
              className={styles["payment-summary__checkout"]}
              type="primary"
              disabled={carts.length === 0 || (balance ?? 0) < totalPrice}
              onClick={proceedToCheckoutHandler}
            >
              {(balance ?? 0) < totalPrice
                ? t("cart.Insufficient Balance")
                : t("cart.Proceed to Payment")}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CartPayment;

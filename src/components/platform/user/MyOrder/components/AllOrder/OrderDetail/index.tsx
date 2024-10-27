import { EFormatDate } from "@/app/common/formatDate";
import { roundNumberDecimal } from "@/app/common/number";
import { parseJsonAddress } from "@/app/common/saveParseJSON";
import iconPendingOrder from "@/assets/icons/order-timeline-pending.svg";
import { ReactComponent as IconSuccessOrder } from "@/assets/icons/order-timeline-success.svg";
import { ReactComponent as IconSuccessCancelled } from "@/assets/icons/order-timeline-cancelled.svg";
import HPButton from "@/components/common/Button";
import HPTable from "@/components/common/HPTable";
import NotFoundPage from "@/components/common/NotFound";
import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import { EKeyTranslations, IColumn } from "@/interfaces/common";
import { EOrderStatus, IOrder } from "@/interfaces/order";
import { orderServices } from "@/service/orderServices";
import { LeftOutlined } from "@ant-design/icons";
import { StepProps } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import TimeLineOrder from "../../../TimelineOrder";
import IconDeliveryOrder from "./IconDeliveryOrder";
import IconProcessingOrder from "./IconProcessingOrder";
import styles from "./style.module.scss";
import { DisplayOrderStatus } from "@/app/common/displayOrderStatus";
import LoadingPlaceholder from "@/components/common/Loader/LoadingPlaceholder";
import { ConfirmDeleteOrder } from "../../ConfirmDeleteOrder";
import { useMediaQuery } from "react-responsive";
import { EResponsiveBreakpoint } from "@/app/constants/responsive-breakpoints";

type Props = {
  handleBack: () => void;
  selectedOrderId: number;
};

export default function OrderDetail({ handleBack, selectedOrderId }: Props) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<IOrder>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const fetchOrderDetail = async () => {
    const [data, error] = await orderServices.getOrderDetail(selectedOrderId);
    if (error) {
      toast.error(error?.message?.data);
      setLoading(false);
    } else if (data) {
      setData(data?.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchOrderDetail();
  }, [selectedOrderId]);

  const isMobile = useMediaQuery({ maxWidth: EResponsiveBreakpoint.md });

  const handleCancelOrder = async () => {
    if (data) {
      const [dataResponse, error] = await orderServices.cancelOrder(
        data.id as number
      );
      if (dataResponse) {
        toast.success(t("myOrder.allOrder.detail.cancelSuccess"));
        fetchOrderDetail();
        setOpenModalConfirm(false);
      } else if (error) {
        toast.error(
          error?.data?.message || t("myOrder.errors.cancelledFailed")
        );
      }
    }
  };

  const column: Array<IColumn> = useMemo(
    () => [
      {
        title: t("myOrder.allOrder.detail.productItems"),
        dataIndex: "productItem",
        key: "productItem",
        render: (productItem: { title: string; url: string }) => {
          return (
            <div className={styles.column__productInfo}>
              <img src={productItem.url} alt="img product" />
              <span>{productItem.title}</span>
            </div>
          );
        },
      },
      {
        title: t("myOrder.allOrder.detail.quantity"),
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity: number) => (
          <p className={styles.column__quantity}>{quantity}</p>
        ),
      },
      {
        title: t("myOrder.allOrder.detail.totalPrice"),
        dataIndex: "totalPrice",
        key: "totalPrice ",
        render: (totalPrice: number) => (
          <p className={styles.column__totalPrice}>${totalPrice}</p>
        ),
      },
    ],
    [t]
  );

  const convertOrderItem = useMemo(() => {
    return data?.orderItem.map((item: any) => {
      return orderAdapter.convertOrderItemFromApi(
        item,
        i18n.language as EKeyTranslations
      );
    });
  }, [data?.orderItem, i18n.language]);
  const userShippingInfo = parseJsonAddress(data?.shippingAddress as string);

  const dataTimeline: StepProps[] = [
    {
      icon: (
        <>
          <div>
            <img
              src={iconPendingOrder}
              className={styles["top__status-icon"]}
            />
          </div>
          <div>{t("myOrder.allOrder.detail.timelinePending")}</div>
        </>
      ),
    },
    {
      icon: (
        <>
          <div>
            <IconProcessingOrder
              className={classNames(styles["top__status-icon"], {
                [styles.active]:
                  Number(data?.status) === EOrderStatus.PROCESSING,
                [styles.passed]: Number(data?.status) > EOrderStatus.PROCESSING,
              })}
            />
          </div>
          <div>{t("myOrder.allOrder.detail.timelineProcessing")}</div>
        </>
      ),
    },
    {
      icon: (
        <>
          <div>
            <IconDeliveryOrder
              className={classNames(styles["top__status-icon"], {
                [styles.active]: Number(data?.status) === EOrderStatus.SHIPPING,
                [styles.passed]: Number(data?.status) > EOrderStatus.SHIPPING,
              })}
            />
          </div>
          <div>{t("myOrder.allOrder.detail.timelineDelivery")}</div>
        </>
      ),
    },
    data?.status === EOrderStatus.CANCELED
      ? {
          icon: (
            <>
              <div>
                <IconSuccessCancelled
                  className={classNames(styles["top__status-icon"], {
                    [styles.active]:
                      Number(data?.status) === EOrderStatus.CANCELED,
                  })}
                />
              </div>
              <div>{t("myOrder.allOrder.detail.timelineCancelled")}</div>
            </>
          ),
        }
      : {
          icon: (
            <>
              <div>
                <IconSuccessOrder
                  className={classNames(styles["top__status-icon"], {
                    [styles.active]:
                      Number(data?.status) === EOrderStatus.FULFILLED,
                  })}
                />
              </div>
              <div>{t("myOrder.allOrder.detail.timelineSucceed")}</div>
            </>
          ),
        },
  ];

  if (loading) return <LoadingPlaceholder isLoading={loading} />;
  return (
    <div className={styles.allOrderItemDetail}>
      <div className={styles.top}>
        <HPButton
          icon={<LeftOutlined />}
          title={isMobile ? "" : t("myOrder.btn.back")}
          onClick={handleBack}
        />
        {!!data && (
          <div className={styles.top__content}>
            <span className={styles.orderNumber}>
              {isMobile ? "" : t("myOrder.allOrder.detail.orderNumber") + " : "}
              {data?.orderCustomId}
            </span>

            <span className={classNames(styles.status)}>
              {DisplayOrderStatus(data?.status as any, t)}
            </span>
          </div>
        )}
      </div>
      {data ? (
        <>
          <div className={styles.content}>
            <div className={styles.content__timeline}>
              <TimeLineOrder
                data={dataTimeline}
                activeTimeline={
                  Number(data.status) === EOrderStatus.CANCELED
                    ? EOrderStatus.FULFILLED
                    : Number(data.status)
                }
              />
            </div>
            <div className={styles.content__info}>
              <div className={styles.shipTo}>
                <p className={`${styles.textInfo} ${styles.title}`}>
                  {t("myOrder.allOrder.detail.shipTo")}
                </p>
                <p className={styles.textInfo}>{userShippingInfo?.name}</p>
                <p className={styles.address}></p>
                <p> {userShippingInfo?.address}</p>
                <p> {userShippingInfo?.street}</p>
                <p> {userShippingInfo?.district}</p>
                <p> {userShippingInfo?.city}</p>
                <p> {userShippingInfo?.country}</p>
              </div>
              {/* <div className={styles.billingTo}>
                <p className={styles.textInfo}>
                  {t("myOrder.allOrder.detail.billingTo")}
                </p>
                <p className={styles.textInfo}>MAI TRAN BICH</p>
                <p className={styles.address}>
                  Suite 2607_26/F Tower 1,The Gateway Harbour City, Tsimshatsui,
                  KC, KC, HONG KONG
                </p>
              </div> */}
              <div className={styles.addressInfo}>
                <p
                  className={`${styles.empty} ${styles.title} ${styles.textInfo}`}
                ></p>
                <p>
                  <span className={styles.textInfo}>
                    {t("myOrder.allOrder.detail.emailAddress")}:
                  </span>
                  <span>{data?.user.email}</span>
                </p>
                <p>
                  <span className={styles.textInfo}>
                    {t("myOrder.allOrder.detail.orderDate")}:
                  </span>
                  <span>
                    {dayjs(data?.createdAt).format(EFormatDate["MM/DD/YYYY"])}
                  </span>
                </p>
                <p>
                  <span className={styles.textInfo}>
                    {t("myOrder.allOrder.table.status")}:
                  </span>
                  <span>{DisplayOrderStatus(data?.status as any, t)}</span>
                </p>
                <p>
                  <span className={styles.textInfo}>
                    {t("myOrder.allOrder.detail.shippingUnit")}:
                  </span>
                  <span>{data?.shippingUnit}</span>
                </p>
              </div>
            </div>
            <div className={styles.content__table}>
              <HPTable columns={column} data={convertOrderItem || []} />
            </div>
            <div className={styles.content__table__mobile}>
              <div className={styles.mbTitle}>
                {t("myOrder.allOrder.detail.productItems")}
              </div>
              {!!convertOrderItem?.length &&
                convertOrderItem.map((item, index) => (
                  <div key={index} className={styles.mbRow}>
                    <div className={styles.mbRow__content}>
                      <img src={item?.productItem?.url} />
                      <div className={styles.mbRow__title}>
                        <p className={styles.titleMain}>
                          {item?.productItem?.title}
                        </p>
                        <p>
                          {t("myOrder.allOrder.detail.quantity")}:{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className={styles.mbRow__price}>
                      ${item.totalPrice}
                    </div>
                  </div>
                ))}
            </div>
            <div className={styles.content__total}>
              <div className={styles.wrapContent}>
                <div>
                  <span className={styles.subTitle}>
                    {t("myOrder.allOrder.detail.subTotal")}
                  </span>
                  <span className={styles.number}>
                    ${roundNumberDecimal(data?.totalPrice as number, 4)}
                  </span>
                </div>
                <div>
                  <span className={styles.subTitle}>
                    {t("myOrder.allOrder.detail.shippingFee")}:
                  </span>

                  <span className={styles.number}>
                    {data?.shippingFee && data?.shippingFee >= 0
                      ? `$ ${data.shippingFee}`
                      : "TBA"}
                  </span>
                </div>
                <div>
                  <span className={styles.title}>
                    {t("myOrder.allOrder.detail.total")}:
                  </span>
                  {!!data?.totalPrice && (
                    <span className={styles.title}>
                      $
                      {roundNumberDecimal(
                        data?.totalPrice + (data?.shippingFee || 0),
                        4
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.wrapGroupBtn}>
            {data.status === EOrderStatus.CREATED && (
              <div className={styles.groupBtn}>
                <div className={styles.cancelBtn}>
                  <HPButton
                    title={t("myOrder.btn.cancel")}
                    onClick={() => setOpenModalConfirm(true)}
                  />
                </div>
              </div>
            )}
          </div>
          <ConfirmDeleteOrder
            open={openModalConfirm}
            onClose={() => setOpenModalConfirm(false)}
            onConfirm={handleCancelOrder}
          />
        </>
      ) : (
        <NotFoundPage message={t("myOrder.allOrder.errors.notFound")} />
      )}
    </div>
  );
}

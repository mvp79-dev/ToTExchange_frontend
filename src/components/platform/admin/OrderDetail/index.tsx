import HPButton from "@/components/common/Button";
import styles from "./style.module.scss";
import { LeftOutlined } from "@ant-design/icons";
import AdminLayout from "@/components/layouts/AdminLayout";
import HPSelect from "@/components/common/Inputs/HPSelect";
import TableAdmin from "../TableAdmin";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Col, Form, Input, Row } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useEffect, useMemo, useState } from "react";
import { orderServices } from "@/service/orderServices";
import { EOrderStatus, IOrder, IShippingInfo } from "@/interfaces/order";
import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import { parseJsonAddress } from "@/app/common/saveParseJSON";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { EFormatDate } from "@/app/common/formatDate";
import { EKeyTranslations } from "@/interfaces/common";
import { roundNumberDecimal } from "@/app/common/number";
import SpinnerLoader from "@/components/common/Loader/SpinnerLoader";
import NotFoundPage from "@/components/common/NotFound";
import { DisplayOrderStatus } from "@/app/common/displayOrderStatus";

const columns = (t: TFunction<"translation", undefined>) => {
  return [
    {
      title: t("adminOrdersDetail.table.name"),
      dataIndex: "productItem",
      key: "productItem",
      render: (productItem: { title: string; url: string }) => {
        return (
          <div className={styles.column__productInfo}>
            <div className={styles.wrapImage}>
              <img src={productItem.url} alt="img product" />
            </div>
            <span>{productItem.title}</span>
          </div>
        );
      },
    },
    {
      title: t("adminOrdersDetail.table.price"),
      dataIndex: "price",
      key: "price",
      render: (price: number) => {
        return <span>${price}</span>;
      },
    },
    {
      title: t("adminOrdersDetail.table.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => {
        return <span>x{quantity}</span>;
      },
    },
    {
      title: t("adminOrdersDetail.table.total"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total: number) => {
        return <span>${total}</span>;
      },
    },
  ];
};

interface IFormData {
  status: string;
  shippingUnit: string;
  note: string;
}

export default function OrderAdminDetailManagement() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id;
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IOrder>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const optionsStatus = useMemo(() => {
    const originalOrderOptions = orderAdapter.renderListStatusOption(t);

    return originalOrderOptions.filter(
      (item) => item.value !== EOrderStatus.CREATED.toString()
    );
    // return orderAdapter.renderListStatusOption(t);
  }, [t]);

  const handleBack = () => {
    navigate(ERoutePath.ADMIN_ORDERS);
  };

  const onFinish = async (value: IFormData) => {
    setIsUpdating(true);
    const [response, error] = await orderServices.updateAdminDetailOrder(
      {
        status: parseInt(value.status),
        note: value.note,
        shippingUnit: value.shippingUnit,
      },
      parseInt(id as string)
    );
    if (error) {
      toast.error((error as any).data?.message);
      setIsUpdating(false);
    }
    if (response) {
      setIsUpdating(false);
      toast.success(t("adminOrdersDetail.alertUpdatedSuccess"));
    }
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const [data, error] = await orderServices.getAdminDetailOrder(
        parseInt(id)
      );
      if (error) {
        setLoading(false);
      } else if (data) {
        setLoading(false);
        setData(data);
        form.setFieldsValue({
          shippingUnit: data.shippingUnit,
          note: data?.note || "",
          status: data?.status ? data?.status.toString() : "",
        });
      }
    })();
  }, [form, id]);

  const userShippingInfo: IShippingInfo = parseJsonAddress(
    data?.shippingAddress as string
  );

  const mappingOrderItem = data?.orderItem.map((item, index) => {
    return orderAdapter.convertOrderItemFromApi(
      item,
      i18n.language as EKeyTranslations
    );
  });

  return (
    <AdminLayout>
      <div className={styles.orderAdminDetail}>
        {loading ? (
          <SpinnerLoader />
        ) : data ? (
          <Form<IFormData> onFinish={onFinish} form={form}>
            <div className={styles.orderAdminDetail__header}>
              <div className={styles.backBtn}>
                <HPButton
                  title=""
                  onClick={handleBack}
                  icon={<LeftOutlined />}
                />
                <span>{t("adminOrdersDetail.title")}</span>
              </div>
              <div className={styles.activeBtn}>
                <HPButton htmlType="submit" title="Save" loading={isUpdating} />
              </div>
            </div>
            <div className={styles.orderAdminDetail__filter}>
              <p>{t("adminOrdersDetail.status")}</p>
              <Form.Item name="status">
                <HPSelect
                  options={optionsStatus}
                  placeholder="Select Company"
                />
              </Form.Item>
            </div>
            <div className={styles.orderAdminDetail__info}>
              <div className={styles.shippingTo}>
                <p className={styles.label}>{t("adminOrdersDetail.shipTo")}</p>
                <p className={styles.label}> {userShippingInfo?.name}</p>
                <p className={styles.subText}>{userShippingInfo?.address}</p>
                <p className={styles.subText}> {userShippingInfo?.street}</p>
                <p className={styles.subText}>{userShippingInfo?.district} </p>
                <p className={styles.subText}> {userShippingInfo?.city} </p>
                <p className={styles.subText}> {userShippingInfo?.country} </p>
                <p className={styles.subText}> {userShippingInfo?.phone} </p>
              </div>
              <div className={styles.billingTo}>
                <p className={styles.label}>{t("adminOrdersDetail.billTo")}</p>
                <p className={styles.label}>MAI TRAN BICH</p>
                <p className={styles.subText}>2291 SE Brookwood </p>
                <p className={styles.subText}>2291 SE Brookwood </p>
                <p className={styles.subText}>2291 SE Brookwood </p>
                <p className={styles.subText}>2291 SE Brookwood </p>
                <p className={styles.subText}>2291 SE Brookwood </p>
              </div>
              <div className={styles.emailInfo}>
                <p>
                  <span>Email: </span>{" "}
                  <span className={styles.subText}>{data?.user.email}</span>
                </p>
                <p>
                  <span>{t("adminOrdersDetail.orderDate")}: </span>{" "}
                  <span className={styles.subText}>
                    {dayjs(data?.createdAt).format(EFormatDate["MM/DD/YYYY"])}
                  </span>
                </p>
                <p>
                  <span>{t("adminOrdersDetail.status")}: </span>{" "}
                  <span className={styles.subText}>
                    {DisplayOrderStatus(
                      Number(form.getFieldValue("status")) as any,
                      t
                    )}
                  </span>
                </p>
                <p className={styles.emailInfo__input}>
                  <span>{t("adminOrdersDetail.shippingUnit")}: </span>{" "}
                  <Form.Item
                    name="shippingUnit"
                    rules={[
                      {
                        max: 50,
                        message: t("modal.modalFormShipping.maxLength", {
                          number: 50,
                        }),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </p>
              </div>
            </div>
            <div className={styles.orderAdminDetail__orderItems}>
              <Row gutter={[30, 30]}>
                <Col span={16}>
                  <div className={styles.table}>
                    <div className={styles.table__header}>
                      <p className={styles.label}>
                        {t("adminOrdersDetail.orderItem")}
                      </p>
                    </div>
                    <div className={styles.table__content}>
                      <TableAdmin
                        columns={columns(t)}
                        data={mappingOrderItem || []}
                      />
                    </div>
                    <div className={styles.table__total}>
                      <div>
                        <div className={styles.wrapContent}>
                          <div>
                            <span className={styles.subTitle}>
                              {t("myOrder.allOrder.detail.subTotal")}
                            </span>
                            <span className={styles.number}>
                              {!!data?.totalPrice &&
                                `$` + roundNumberDecimal(data?.totalPrice, 4)}
                            </span>
                          </div>
                          <div>
                            <span className={styles.subTitle}>
                              {t("myOrder.allOrder.detail.shippingFee")}:
                            </span>
                            <span className={styles.number}>
                              {data?.shippingFee && data?.shippingFee >= 0
                                ? `$ ${data.shippingFee}`
                                : `TBA`}
                            </span>
                          </div>
                          <div>
                            <span className={styles.title}>
                              {t("myOrder.allOrder.detail.total")}:
                            </span>

                            <span className={styles.title}>
                              {!!data?.totalPrice &&
                                `$` +
                                  roundNumberDecimal(
                                    data?.totalPrice + (data?.shippingFee || 0),
                                    4
                                  )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className={styles.paymentInfo}>
                    <p className={styles.paymentInfo__title}>
                      {t("adminOrdersDetail.paymentInfo")}
                    </p>
                    <div className={styles.paymentInfo__masterCard}>
                      <div className={styles.paymentInfo__rect}></div>
                      <span>Master Card **** ***13</span>
                    </div>
                    <p>
                      <span>{t("adminOrdersDetail.businessName")}:</span>{" "}
                      <span>Master Card. Inc</span>
                    </p>
                    <p>
                      <span> {t("adminOrdersDetail.phone")}: </span>
                      <span>+1 (000) 121-635-45</span>
                    </p>
                  </div>
                  <div className={styles.note}>
                    <p className={styles.label}>
                      {t("adminOrdersDetail.note")}
                    </p>
                    <Form.Item name="note">
                      <Input.TextArea rows={8} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        ) : (
          <NotFoundPage message="Can not found order" />
        )}
      </div>
    </AdminLayout>
  );
}

import TableAdmin from "../../TableAdmin";
import styles from "./styles.module.scss";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { generatePath, useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import _ from "lodash";
import { truncateText } from "@/app/common/helper";
import dayjs from "dayjs";
import { EFormatDate } from "@/app/common/formatDate";
import HPTooltip from "@/components/common/HPTooltip";
import { EOrderStatus } from "@/interfaces/order";
import { DisplayOrderStatus } from "@/app/common/displayOrderStatus";

const columns = (t: TFunction<"translation", undefined>) => {
  return [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (index: string) => {
        return <p className={styles.column__id}>{index}</p>;
      },
    },
    {
      title: t("adminOrders.tableColumn.orderId"),
      dataIndex: "orderCustomId",
      key: "orderCustomId",
      render: (orderCustomId: string) => {
        return (
          <span>
            <HPTooltip
              title={orderCustomId}
              icon={truncateText(orderCustomId, 10, 10)}
              maxWidth={350}
            />
          </span>
        );
      },
    },
    {
      title: t("adminOrders.tableColumn.date"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        return (
          <span>{dayjs(createdAt).format(EFormatDate["DD/MM/YYYY"])}</span>
        );
      },
    },
    {
      title: t("adminOrders.tableColumn.customer"),
      dataIndex: "customer",
      key: "customer",
      render: (customer: string) => {
        return <span>{customer}</span>;
      },
    },
    {
      title: t("adminOrders.tableColumn.total"),
      dataIndex: "total",
      key: "total",
      render: (total: number) => {
        return <span>${total}</span>;
      },
    },
    {
      title: t("adminOrders.tableColumn.shippingUnit"),
      dataIndex: "shippingUnit",
      key: "shippingUnit",
      render: (shippingUnit: string) => {
        return <span>{shippingUnit}</span>;
      },
    },
    {
      title: t("adminOrders.tableColumn.fee"),
      dataIndex: "fee",
      key: "fee",
      render: (fee: number) => {
        return <span>${fee}</span>;
      },
    },
    {
      title: t("adminOrders.tableColumn.status"),
      dataIndex: "status",
      key: "status",
      render: (status: EOrderStatus) => {
        return DisplayOrderStatus(status, t);
      },
    },
  ];
};

type data = {
  id: number;
  index: number;
  orderCustomId: string;
  createdAt: Date | string;
  customer: string;
  total: number;
  shippingUnit: string;
  fee: number;
  status: EOrderStatus;
};

type Props = {
  data: data[];
};

const TableOrders = ({ data }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleViewDetail = (itemId: string) => {
    navigate(
      generatePath(ERoutePath.ADMIN_ORDERS_DETAIL, {
        id: String(itemId),
      })
    );
  };
  return (
    <div className={styles.orderAdmin__table}>
      <TableAdmin
        columns={columns(t)}
        data={data}
        onRowClick={(data: any) => handleViewDetail(data.id)}
      />
    </div>
  );
};

export default TableOrders;

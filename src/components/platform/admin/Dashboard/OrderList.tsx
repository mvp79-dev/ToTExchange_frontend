import HPSelect, { IOpionsHPSelect } from "@/components/common/Inputs/HPSelect";
import { IColumn } from "@/interfaces/common";
import React from "react";
import style from "./style.module.scss";
import TableAdmin from "../TableAdmin";
type Props = {};

export default function OrderList() {
  const options: IOpionsHPSelect[] = [
    {
      label: "This week",
      value: "week",
    },
  ];

  const columns: Array<IColumn> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "ID Number",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Shipping Unit",
      dataIndex: "shippingUnit",
      key: "shippingUnit",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div className={style.orderList}>
      <div className={style.filter}>
        <span>Order List</span>
        <HPSelect options={options} onChange={() => {}} value="week" />
      </div>
      <TableAdmin data={[]} columns={columns} />
    </div>
  );
}

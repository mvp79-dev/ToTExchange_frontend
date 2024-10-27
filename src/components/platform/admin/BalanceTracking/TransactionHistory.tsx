import HPSelect from "@/components/common/Inputs/HPSelect";
import TableAdmin from "../TableAdmin";
import style from "./style.module.scss";
import { IColumn, IQuery } from "@/interfaces/common";
import { useEffect, useState } from "react";
import { adminService } from "@/service/adminService";
import { EPackageTimeTypeParam } from "@/service/chartService";
import { ITolaVolumeItem } from "@/interfaces/admin";
import { selectDurationOptions } from "@/app/common/selectOptions";
import { useTranslation } from "react-i18next";
import { adminDataAdapter } from "@/helpers/adapters/AdminAdapter";
import HPTooltip from "@/components/common/HPTooltip";
import { truncateText } from "@/app/common/helper";
import { IPaginationTable } from "@/components/common/HPTable";
import { TFunction } from "i18next";
import { TSortKey } from "@/interfaces/product";

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const DEFAULT_ORDER_BY = "desc";
const DEFAULT_SORT_BY = "createdAt";

const DEFAULT_QUERY = {
  page: DEFAULT_PAGE,
  size: DEFAULT_SIZE,
  order_by: DEFAULT_ORDER_BY as any,
  sort_by: DEFAULT_SORT_BY,
  packageTimeType: EPackageTimeTypeParam.by_week,
};

type TRestrictedSortKey = Exclude<TSortKey, "">;

const listSortBy = (t: TFunction<"translation", undefined>) => {
  return [{ label: t("myOrder.orderBY.date"), value: "createdAt" }];
};

const listOrderBy = (t: TFunction<"translation", undefined>) => {
  return [
    { label: t("myOrder.sorting.ascending"), value: "asc" },
    { label: t("myOrder.sorting.descending"), value: "desc" },
  ];
};

export default function TransactionHistory() {
  const { t } = useTranslation();
  const [dataTable, setDataTable] = useState<{
    data: ITolaVolumeItem[];
    meta: { count: number; totalPages: number };
  }>({ data: [], meta: { count: 0, totalPages: 0 } });

  const [query, setQuery] = useState<IQuery>(DEFAULT_QUERY);

  const columns: Array<IColumn> = [
    {
      title: t("estimateBalance.No"),
      dataIndex: "index",
      key: "index",
    },
    {
      title: t("estimateBalance.Hash"),
      dataIndex: "hash",
      key: "hash",
      render: (hash: string) => {
        return (
          <span>
            <HPTooltip
              title={hash}
              icon={truncateText(hash, 10, 10)}
              maxWidth={350}
            />
          </span>
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
      title: t("commission.Type"),
      dataIndex: "type",
      key: "type",
    },
    {
      title: t("myOrder.allOrder.table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span>${amount}</span>;
      },
    },
    {
      title: t("profile.textTitleTableDate"),
      dataIndex: "date",
      key: "date",
    },
  ];

  useEffect(() => {
    (async () => {
      const res = await adminService.getListTotalVolume(query);
      if (res) {
        setDataTable({ data: res.data, meta: res.meta });
      }
    })();
  }, [query]);

  return (
    <div className={style.transactionHistory}>
      <div className={style.filter}>
        <span>{t("estimateBalance.totalVolume")}</span>
        <div className={style.filterOption}>
          <HPSelect
            options={selectDurationOptions(t)}
            onChange={(value: string) => {
              setQuery({
                ...query,
                page: DEFAULT_PAGE,
                packageTimeType: value as EPackageTimeTypeParam,
              });
            }}
            value={query.packageTimeType}
          />
          <HPSelect
            options={listSortBy(t)}
            value={query.sort_by}
            onChange={function (value: string): void {
              setQuery({
                ...query,
                sort_by: value,
              });
            }}
          />
          <HPSelect
            options={listOrderBy(t)}
            value={query.order_by}
            defaultValue={DEFAULT_ORDER_BY}
            onChange={function (value: string): void {
              setQuery({
                ...query,
                order_by: value as TRestrictedSortKey,
              });
            }}
          />
        </div>
      </div>
      <TableAdmin
        rowKey="id"
        data={dataTable.data.map((item, index) => {
          return adminDataAdapter.convertTotalVolumeFromApi(item, t, index);
        })}
        columns={columns}
        pagination={{
          isShow: true,
          page: query.page,
          pageSize: query.size,
          totalPage: dataTable.meta.totalPages,
          totalItem: dataTable.meta.count,
        }}
        onChangePagination={(data: IPaginationTable) => {
          setQuery({
            ...query,
            page: data.page,
            size: data.pageSize,
          });
        }}
      />
    </div>
  );
}

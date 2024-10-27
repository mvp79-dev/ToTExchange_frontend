import { useEffect, useState } from "react";
import TableAdmin from "../TableAdmin";
import style from "./style.module.scss";
import { IColumn, IQuery } from "@/interfaces/common";
import HPSelect from "@/components/common/Inputs/HPSelect";
import { EPackageTimeTypeParam } from "@/service/chartService";
import { EWithDrawStatus, IWithdrawItem } from "@/interfaces/admin";
import { useTranslation } from "react-i18next";
import { adminService } from "@/service/adminService";
import { adminDataAdapter } from "@/helpers/adapters/AdminAdapter";
import HPTooltip from "@/components/common/HPTooltip";
import { truncateText } from "@/app/common/helper";
import { formatCurrency } from "@/app/common/currency";
import HPButton from "@/components/common/Button";
import { TSortKey } from "@/interfaces/product";
import { TFunction } from "i18next";
import { toast } from "react-toastify";
import HPPagination from "@/components/common/HPPagination";

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const DEFAULT_ORDER_BY = "desc";
const DEFAULT_SORT_BY = "createdAt";

const DEFAULT_QUERY = {
  page: DEFAULT_PAGE,
  size: DEFAULT_SIZE,
  order_by: DEFAULT_ORDER_BY as any,
  sort_by: DEFAULT_SORT_BY,
  // packageTimeType: EPackageTimeTypeParam.by_week,
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

const columns = (
  t: TFunction<"translation", undefined>,
  action: (id: number, isAccept: boolean) => void
) => {
  return [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (index: string) => {
        return <span className={style.wrapIndex}>{index}</span>;
      },
    },
    {
      title: "Order ID",
      dataIndex: "orderCustomId",
      key: "orderCustomId",
      render: (id: string) => {
        return (
          <span>
            <HPTooltip
              title={id}
              icon={truncateText(id, 10, 10)}
              maxWidth={350}
            />
          </span>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => {
        return <span className={style.active}>$ {formatCurrency(amount)}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: EWithDrawStatus) => {
        return (
          <p className={style.wrapStatus}>
            {adminDataAdapter.mappingWithdrawStatus(status, t)}{" "}
          </p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: ({ id, status }: { id: number; status: EWithDrawStatus }) => {
        if (status === EWithDrawStatus.CREATED) {
          return (
            <div className={style.groupActionBtn}>
              <HPButton
                className={style.approveBtn}
                title="Approve"
                onClick={() => action(id, true)}
              />
              <HPButton
                className={style.rejectBtn}
                title="Reject"
                onClick={() => action(id, false)}
              />
            </div>
          );
        }
        return;
      },
    },
  ];
};

export default function WithdrawalOrder() {
  const { t } = useTranslation();

  const [query, setQuery] = useState<IQuery>(DEFAULT_QUERY);

  const [dataTable, setDataTable] = useState<{
    data: IWithdrawItem[];
    meta: { count: number; totalPages: number };
  }>({ data: [], meta: { count: 0, totalPages: 0 } });

  const fetchDataListWithdraw = async (query: IQuery) => {
    const res = await adminService.getListWithdraw(query);
    if (res) {
      setDataTable({ data: res.data, meta: res.meta });
    }
  };

  useEffect(() => {
    fetchDataListWithdraw(query);
  }, [query]);

  const handleUpdateStatusWithdrawRq = async (
    id: number,
    isAccept: boolean
  ) => {
    const [data, error] = await adminService.updateStatusWithdrawRequest(
      id,
      isAccept
    );
    if (error) {
      toast.error(error?.data?.message[0] || "Update withdraw request failed!");
    } else if (data) {
      toast.success("You have just updated withdraw request successfully!");
      fetchDataListWithdraw(query);
    }
  };

  return (
    <div className={style.withdrawalOrder}>
      <div className={style.filter}>
        <span>Withdrawal Order</span>
        <div className={style.filterOption}>
          {/* <HPSelect
            options={selectDurationOptions(t)}
            onChange={(value: string) => {
              setQuery({
                ...query,
                page: DEFAULT_PAGE,
                packageTimeType: value as EPackageTimeTypeParam,
              });
            }}
            value={query.packageTimeType}
          /> */}
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
          return adminDataAdapter.convertWithdrawFromApi(item, t, index);
        })}
        columns={columns(t, handleUpdateStatusWithdrawRq)}
      />
      <div className={style.pagination}>
        <HPPagination
          totalItem={dataTable.meta.count}
          pageSize={query.size}
          currentPage={query.page}
          isShowTotalItems={false}
          onChange={function (page: number, pageSize: number): void {
            setQuery({
              ...query,
              page: page,
              size: pageSize,
            });
          }}
        />
      </div>
    </div>
  );
}

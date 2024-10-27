import UserLayout from "@/components/layouts/UserLayout";
import RegisterAffiliateBanner from "@/components/platform/product/shared/RegisterAffiliate";

import HPTable, { IPaginationTable } from "@/components/common/HPTable";
import { IColumn, IQuery } from "@/interfaces/common";
import { ICommissionHistory } from "@/interfaces/user";
import { userServices } from "@/service/userService";
import _upperCase from "lodash/upperCase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./style.module.scss";
import dayjs from "dayjs";

function CommissionPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<{
    data: ICommissionHistory[];
    meta: { count: number; totalPages: number };
  }>({ data: [], meta: { count: 0, totalPages: 0 } });
  const [params, setParams] = useState<IQuery>({
    page: 1,
    size: 10,
  });

  const getCommissionsHistory = useCallback(async () => {
    const [res, error] = await userServices.getCommissionsHistory(params);
    if (res) {
      setData({ data: res.data, meta: res.meta });
    }
  }, [params]);

  useEffect(() => {
    getCommissionsHistory();
  }, [getCommissionsHistory]);

  const commissionColumns: IColumn[] = useMemo(() => {
    return [
      {
        title: t("commission.Commission Total"),
        dataIndex: "currentTotalCommission",
        key: "totalCommission",
        render: (data: string) => {
          return data ? <span>${data}</span> : "N/A";
        },
      },
      {
        title: t("commission.Previous Balance"),
        dataIndex: "previousBalance",
        key: "previousBalance",
        render: (data: string) => {
          return data ? <span>${data}</span> : "N/A";
        },
      },
      {
        title: t("commission.Adjustment"),
        dataIndex: "adjustment",
        key: "adjustment",
        render: (data: string) => {
          return data ? (
            <span className={styles.activeText}>${data}</span>
          ) : (
            "N/A"
          );
        },
      },
      {
        title: t("commission.Balance Forward"),
        dataIndex: "balanceForward",
        key: "balanceForward",
        render: (data: string) => {
          return data ? <span>${data}</span> : "N/A";
        },
      },
      {
        title: t("commission.Type"),
        dataIndex: "type",
        key: "type",
        render: (data: string) => {
          return data ? <span>{_upperCase(data)}</span> : "N/A";
        },
      },
      {
        title: t("commission.username"),
        dataIndex: "grantor.userName",
        key: "grantor.userName",
        render: (data: string, commissionItem: ICommissionHistory) => {
          return commissionItem.grantor?.userName ?? "N/A";
        },
      },
      {
        title: t("commission.paid at"),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (data: string) => {
          return data ? (
            <span>{dayjs(data).format("DD/MM/YYYY hh:mm")}</span>
          ) : (
            "N/A"
          );
        },
      },
    ];
  }, [t]);

  const handleChangePagination = (data: IPaginationTable) => {
    setParams({ page: data.page, size: data.pageSize });
  };

  return (
    <UserLayout>
      <div className={styles["commission-page"]}>
        <h3 className={styles["commission-page__title"]}>
          {t("commission.Commissions")}
        </h3>
        <HPTable
          className={styles["commission-page__table"]}
          columns={commissionColumns}
          data={data?.data ?? []}
          onChangePagination={handleChangePagination}
          pagination={{
            isShow: true,
            page: params.page,
            pageSize: params.size,
            totalPage: data.meta.totalPages,
            totalItem: data.meta.count,
          }}
        />
      </div>

      <RegisterAffiliateBanner />
    </UserLayout>
  );
}

export default CommissionPage;

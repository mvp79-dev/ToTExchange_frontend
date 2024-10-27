import HPButton from "@/components/common/Button";
import styles from "./style.module.scss";
import HPSelect from "@/components/common/Inputs/HPSelect";
import InputNormal, {
  IDataInput,
} from "@/components/common/Inputs/InputNormal";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import HPTable from "@/components/common/HPTable";
import { EMyOrderStatus } from "../../..";
import classNames from "classnames";
import refreshIcon from "../../../../../../../assets/icons/button-refresh.svg";
import HPPagination from "@/components/common/HPPagination";
import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { IQuery } from "@/interfaces/common";
import { useAppSelector, useDebounce } from "@/app/hooks";
import { TSortKey } from "@/interfaces/product";
import { orderAction, orderSelect } from "@/features/order/orderSlice";
import { DisplayOrderStatus } from "@/app/common/displayOrderStatus";
import { EOrderStatus } from "@/interfaces/order";
import HPTooltip from "@/components/common/HPTooltip";
import { truncateText } from "@/app/common/helper";

type Props = {
  handleViewDetailOrder: (id: number) => void;
};

type TRestrictedSortKey = Exclude<TSortKey, "">;

type TSortQueryType = Omit<IQuery, "filter">;

const defaultQueries: TSortQueryType = {
  order_by: "desc",
  sort_by: "createdAt",
  page: 1,
  size: 10,
};

export default function ListOrders({ handleViewDetailOrder }: Props) {
  const { listOrders, totalItems } = useAppSelector(orderSelect);
  const [inputValue, setInputValue] = useState<string>("");
  const [queries, setQueries] = useState<TSortQueryType>(defaultQueries);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const debounceSearch = useDebounce(inputValue);
  const listOrderBy = useMemo(
    () => [
      { label: t("myOrder.sorting.ascending"), value: "asc" },
      { label: t("myOrder.sorting.descending"), value: "desc" },
    ],
    [t]
  );

  const listSortBy = useMemo(
    () => [
      { label: t("myOrder.orderBY.date"), value: "createdAt" },
      { label: t("myOrder.orderBY.amount"), value: "totalPrice" },
    ],
    [t]
  );

  const column = useMemo(
    () => [
      {
        title: t("myOrder.allOrder.table.yourOrder"),
        dataIndex: "key",
        key: "key",
        render: (key: string) => (
          <div className={styles.column__name}>{key}</div>
        ),
      },
      {
        title: t("myOrder.allOrder.table.itemCount"),
        dataIndex: "totalItem",
        key: "totalItem",
        render: (totalItem: number) => (
          <div className={styles.column__totalItem}>{totalItem}</div>
        ),
      },
      {
        title: t("myOrder.allOrder.table.amount"),
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => (
          <div className={styles.column__amount}>${amount}</div>
        ),
      },
      {
        title: t("myOrder.allOrder.table.status"),
        dataIndex: "status",
        key: "status",
        render: (status: EOrderStatus) => (
          <div className={classNames(styles.column__status)}>
            {DisplayOrderStatus(status, t)}
          </div>
        ),
      },
    ],
    [t]
  );

  const handleRefresh = () => {
    setQueries(defaultQueries);
    setInputValue("");
  };

  const mappingListOrders = orderAdapter.convertOrderViewList(listOrders);

  useEffect(() => {
    dispatch(
      orderAction.getListOrdersRequest({
        ...queries,
        filter: debounceSearch,
      })
    );
  }, [dispatch, queries, debounceSearch]);

  const handleSelectFiler = (filter: IQuery) => {
    setQueries({
      ...queries,
      ...filter,
    });
  };

  const handleChangeSearch = (value: string) => {
    dispatch(orderAction.resetCondition());
    setInputValue(value);
  };

  return (
    <div className={styles.allOrderItem}>
      <div className={styles.allOrderItem__top}>
        <p className={styles.top__title}>{t("myOrder.allOrder.title")}</p>
      </div>
      <div className={styles.allOrderItem__filter}>
        <div className={styles.wrapInputFilter}>
          <div className={styles.wrapInputSearch}>
            <InputNormal
              value={inputValue}
              placeholder={t("myOrder.placeholder.searchOrder")}
              name={""}
              onChange={function (data: IDataInput): void {
                handleChangeSearch(data.value?.toLocaleUpperCase() as string);
              }}
            />
            <HPButton title={t("myOrder.btn.search")} />
          </div>
        </div>
        <div className={styles.wrapSelectFilter}>
          <p className={styles.textTitle}>{t("myOrder.allOrder.sortBy")}:</p>

          <HPSelect
            options={listSortBy}
            value={queries.sort_by}
            onChange={function (value: string): void {
              handleSelectFiler({
                ...queries,
                sort_by: value,
              });
            }}
          />
          <HPSelect
            options={listOrderBy}
            value={queries.order_by}
            onChange={function (value: string): void {
              handleSelectFiler({
                ...queries,
                order_by: value as TRestrictedSortKey,
              });
            }}
          />
        </div>
      </div>
      <div className={styles.allOrderItem__table}>
        <HPTable
          columns={column}
          data={mappingListOrders}
          onRowClick={(data: any) => {
            handleViewDetailOrder(data.id);
          }}
        />
      </div>
      <div className={styles.allOrderItem__table__mobile}>
        {mappingListOrders.map((item, index) => (
          <div key={index} onClick={() => handleViewDetailOrder(item.id)}>
            <div className={styles.mbRow}>
              <span className={styles.mbTitle}>
                {t("myOrder.allOrder.table.yourOrder")}
              </span>
              <span>
                <HPTooltip
                  title={item.key}
                  icon={truncateText(item.key, 10, 10)}
                  maxWidth={350}
                />
              </span>
            </div>
            <div className={styles.mbRow}>
              <span className={styles.mbTitle}>
                {t("myOrder.allOrder.table.itemCount")}
              </span>
              <span> {item.totalItem}</span>
            </div>
            <div className={styles.mbRow}>
              <span className={styles.mbTitle}>
                {t("myOrder.allOrder.table.amount")}
              </span>
              <span>${item.amount}</span>
            </div>
            <div className={styles.mbRow}>
              <span className={styles.mbTitle}>
                {t("myOrder.allOrder.table.status")}
              </span>
              <span className={classNames(styles.column__status)}>
                {DisplayOrderStatus(item.status, t)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.allOrderItem__pagination}>
        {!!listOrders.length && (
          <HPPagination
            totalItem={totalItems}
            pageSize={defaultQueries.size}
            currentPage={queries.page}
            isShowTotalItems={false}
            onChange={function (page: number, pageSize: number): void {
              setQueries({
                ...queries,
                page,
              });
            }}
          />
        )}

        {/* <div className={styles.allOrderItem__refreshBtn}>
          <HPButton
            title={t("myOrder.btn.refresh")}
            icon={<img src={refreshIcon} />}
            onClick={handleRefresh}
          />
        </div> */}
      </div>
    </div>
  );
}

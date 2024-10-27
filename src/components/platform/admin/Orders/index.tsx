import styles from "./styles.module.scss";
import AdminLayout from "@/components/layouts/AdminLayout";
import InputNormal, {
  IDataInput,
} from "@/components/common/Inputs/InputNormal";
import { SearchOutlined } from "@ant-design/icons";
import HPSelect from "@/components/common/Inputs/HPSelect";
import TableOrders from "./OrderTable";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { orderAction, orderSelect } from "@/features/order/orderSlice";
import { useAppSelector, useDebounce } from "@/app/hooks";
import { orderAdapter } from "@/helpers/adapters/OrderAdapter";
import HPPagination from "@/components/common/HPPagination";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { IQuery } from "@/interfaces/common";
import { TSortKey } from "@/interfaces/product";
import { getPastDateEndOfDay } from "@/app/common/date";
import { Col, Row } from "antd";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_ORDER_BY = "desc";

type TRestrictedSortKey = Exclude<TSortKey, "">;

enum EFilterSelectedDays {
  week = "7",
  month = "30",
}

const listSortBy = (t: TFunction<"translation", undefined>) => {
  return [
    { label: t("myOrder.orderBY.date"), value: "createdAt" },
    { label: t("myOrder.orderBY.amount"), value: "totalPrice" },
    { label: t("myOrder.orderBY.orderId"), value: "orderId" },
  ];
};

const listFilterByTime = (t: TFunction<"translation", undefined>) => {
  return [
    { label: "This week", value: EFilterSelectedDays.week },
    { label: "This month", value: EFilterSelectedDays.month },
  ];
};

const listOrderBy = (t: TFunction<"translation", undefined>) => {
  return [
    { label: t("myOrder.sorting.ascending"), value: "asc" },
    { label: t("myOrder.sorting.descending"), value: "desc" },
  ];
};
export default function OrdersManagementAdmin() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { condition, listOrders, totalItems } = useAppSelector(orderSelect);
  const [inputValue, setInputValue] = useState<string>("");

  const debounceSearch = useDebounce(inputValue);

  useEffect(() => {
    dispatch(
      orderAction.getListAdminOrdersRequest({
        ...condition,
        filter: debounceSearch,
      })
    );
  }, [condition, dispatch, debounceSearch]);

  useEffect(() => {
    return () => {
      dispatch(orderAction.resetCondition());
    };
  }, [dispatch]);

  const handleChangeSearch = (value: string) => {
    dispatch(orderAction.resetCondition());
    setInputValue(value);
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    dispatch(
      orderAction.updateOrderCondition({ ...condition, page, size: pageSize })
    );
  };

  const handleSelectFiler = (filter: IQuery) => {
    dispatch(
      orderAction.updateOrderCondition({
        ...condition,
        ...filter,
      })
    );
  };

  const optionsStatus = useMemo(
    () => [
      {
        label: t("adminOrders.statusOptionAll"),
        value: "",
      },
      ...orderAdapter.renderListStatusOption(t),
    ],
    [t]
  );
  return (
    <AdminLayout>
      <div className={styles.orderAdmin}>
        <div className={styles.orderAdmin__header}>
          <Row gutter={[30, 30]}>
            <Col md={24} xxl={6}>
              <div className={styles.searchInput}>
                <InputNormal
                  value={inputValue}
                  name={""}
                  placeholder="Order Search"
                  onChange={function (data: IDataInput): void {
                    handleChangeSearch(
                      data.value?.toLocaleUpperCase() as string
                    );
                  }}
                  prefix={<SearchOutlined />}
                />
              </div>
            </Col>
            <Col md={24} xxl={18}>
              <div className={styles.filter}>
                <div className={styles.filter__showBy}>
                  <p>Show by</p>
                  <HPSelect
                    options={optionsStatus}
                    value={condition.status}
                    defaultValue={optionsStatus[0].value}
                    onChange={function (value: string): void {
                      handleSelectFiler({
                        ...condition,
                        page: DEFAULT_CURRENT_PAGE,
                        status: value,
                      });
                    }}
                  />
                  <HPSelect
                    options={listFilterByTime(t)}
                    onChange={function (value: string): void {
                      handleSelectFiler({
                        ...condition,
                        createdAt_gte: getPastDateEndOfDay(
                          parseInt(value)
                        ).toDate(),
                        createdAt_lte: new Date(),
                      });
                    }}
                  />
                </div>
                <div className={styles.filter__sortBy}>
                  <p>Sort By</p>
                  <HPSelect
                    options={listSortBy(t)}
                    value={condition.sort_by}
                    onChange={function (value: string): void {
                      handleSelectFiler({
                        ...condition,
                        sort_by: value,
                      });
                    }}
                  />
                  <HPSelect
                    options={listOrderBy(t)}
                    value={condition.order_by}
                    defaultValue={DEFAULT_ORDER_BY}
                    onChange={function (value: string): void {
                      handleSelectFiler({
                        ...condition,
                        order_by: value as TRestrictedSortKey,
                      });
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <TableOrders data={orderAdapter.convertAdminOrderList(listOrders, t)} />
        <div className={styles.orderAdmin__pagination}>
          <HPPagination
            totalItem={totalItems}
            pageSize={condition.size}
            currentPage={condition.page}
            isShowTotalItems={false}
            onChange={function (page: number, pageSize: number): void {
              handleChangePagination(page, pageSize);
            }}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

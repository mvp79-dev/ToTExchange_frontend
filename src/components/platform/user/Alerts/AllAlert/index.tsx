import HPPagination from "@/components/common/HPPagination";
import styles from "./style.module.scss";
import AlertComponent from "../AlertComponent";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { AlertSelect, alertActions } from "@/features/alert/alertSlice";
import { alertDataAdapter } from "@/helpers/adapters/AlertAdapter";
import { Empty } from "antd";

export default function AllALert() {
  const { t } = useTranslation();
  const { condition, listAlert, totalItems } = useAppSelector(AlertSelect);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(alertActions.getListAlertsRequest(condition));
  }, [condition, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(alertActions.resetCondition());
    };
  }, [dispatch]);

  const handleChangePagination = (page: number) => {
    dispatch(alertActions.updateCondition({ ...condition, page }));
  };
  const transformDataFromApiRes = listAlert.map((alert, index) =>
    alertDataAdapter.convertDataAlertResponseApi(alert, t)
  );

  return (
    <div className={styles.allAlert}>
      <p className={styles.allAlert__title}>{t("alerts.alert")}</p>
      {transformDataFromApiRes.length ? (
        <>
          <div className={styles.allAlert__content}>
            {transformDataFromApiRes.map((alert, index) => (
              <AlertComponent {...alert} key={index} />
            ))}
          </div>
          <div>
            <HPPagination
              className={styles.allAlert__pagination}
              totalItem={totalItems}
              pageSize={condition.size}
              currentPage={condition.page}
              isShowTotalItems={false}
              onChange={function (page: number, pageSize: number): void {
                handleChangePagination(page);
              }}
            />
          </div>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}

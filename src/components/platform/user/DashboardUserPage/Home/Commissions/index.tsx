import IconExport from "@/assets/icons/exportIcon.svg";
import IconPaid from "@/assets/icons/iconPaid.svg";
import { Col, Row } from "antd";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { useCallback, useEffect, useState } from "react";
import { userServices } from "@/service/userService";
import { ICommissionHistory } from "@/interfaces/user";

export default function Commissions() {
  const { t } = useTranslation();
  const dataCommissions = [
    {
      label: t("dashboardUser.commissions.labelCommissionAmount"),
      key: "currentTotalCommission",
    },
    {
      label: t("dashboardUser.commissions.labelPreviousBalance"),
      key: "previousBalance",
    },
    {
      label: t("dashboardUser.commissions.labelAdjustment"),
      key: "adjustment",
    },
    {
      label: t("dashboardUser.commissions.labelBalanceForward"),
      key: "balanceForward",
    },
  ];

  const [data, setData] = useState<ICommissionHistory[]>([]);

  const getCommissionsHistory = useCallback(async () => {
    const [res, error] = await userServices.getCommissionsHistory({
      page: 1,
      size: 3,
    });
    if (res) {
      setData(res.data);
    }
  }, []);

  useEffect(() => {
    getCommissionsHistory();
  }, [getCommissionsHistory]);

  const navigate = useNavigate();

  return (
    <div className={style.commissions}>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <div className={style.header}>
            <div className={style.title}>
              <div>{t("dashboardUser.commissions.title")}</div>
              {/* <span className={style.lastDate}>
                {t("dashboardUser.commissions.textDate")}: 08/15/2023, 1:04 PM
              </span> */}
            </div>
            <div
              className={style.action}
              onClick={() => navigate(ERoutePath.MY_COMMISSION)}
            >
              {t("dashboardUser.commissions.textViewAll")}
            </div>
          </div>
        </Col>
        <Col span={24}>
          {data.map((el, idx) => (
            <div className={style.commissionItem} key={idx}>
              <div className={style.info}>
                {dataCommissions.map((dt, id) => (
                  <div key={id}>
                    <span className={style.label}>{dt.label}: </span>
                    <span className={style.value}>
                      ${(el as any)?.[dt.key] ?? ""}
                    </span>
                  </div>
                ))}
                <div className={style.paid}>
                  <img src={IconPaid} alt="" />
                  <span className={style.textPaid}>Paid</span>
                </div>
              </div>
              <div className={style.action}>
                <img src={IconExport} alt="" />
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

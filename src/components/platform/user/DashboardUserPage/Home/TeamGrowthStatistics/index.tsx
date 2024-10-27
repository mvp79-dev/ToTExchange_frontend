import { Col, Row } from "antd";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { ITeamGrowthStatistics } from "@/interfaces/user";
import { useCallback, useEffect, useState } from "react";
import { userServices } from "@/service/userService";

interface IDataTeamGrowthStatistics {
  label: string;
  key: string;
  suffix?: string;
}

export default function TeamGrowthStatistics() {
  const { t } = useTranslation();
  const dataTeamGrowthStatistics: IDataTeamGrowthStatistics[] = [
    {
      label: t("dashboardUser.teamGrowth.labelTotalDownline"),
      key: "totalDownlineAmount",
    },
    {
      label: t("dashboardUser.teamGrowth.labelFrontLine"),
      key: "frontLineAmount",
    },
    {
      label: t("dashboardUser.teamGrowth.labelNew3Days"),
      key: "newUserAmount",
    },
    {
      label: t("dashboardUser.teamGrowth.labelLast3Days"),
      key: "lastThreeDaysGrowthPercentOfTeam",
      suffix: "%",
    },
    {
      label: t("dashboardUser.teamGrowth.labelLast30Days"),
      key: "lastThreeDaysGrowthPercentOfTeam",
      suffix: "%",
    },
    {
      label: t("dashboardUser.teamGrowth.labelDeepestLevel"),
      key: "deepestLevel",
    },
  ];

  const [data, setData] = useState<ITeamGrowthStatistics>();

  const getTeamGrowthStatistics = useCallback(async () => {
    const [res, error] = await userServices.getTeamGrowthStatistics();
    if (res) {
      setData(res.data);
    }
  }, []);

  useEffect(() => {
    getTeamGrowthStatistics();
  }, [getTeamGrowthStatistics]);

  return (
    <div className={style.teamGrowth}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <div className={style.title}>
            {t("dashboardUser.teamGrowth.title")}
          </div>
          {/* <p className={style.lastDate}>
            {t("dashboardUser.teamGrowth.textDate")}: 08/15/2023, 1:04 PM GMT+7
          </p> */}
        </Col>
        <Col span={24}>
          <div className={style.teamGrowthList}>
            {dataTeamGrowthStatistics.map((el, index) => (
              <div className={style.teamGrowthItem} key={index}>
                <span className={style.label}>{el.label}</span>
                <span className={style.value}>
                  {data?.[el.key as keyof ITeamGrowthStatistics]}
                  {el?.suffix}
                </span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}

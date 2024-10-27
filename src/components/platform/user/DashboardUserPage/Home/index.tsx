import { takeDecimalNumber } from "@/app/common/helper";
import { useAppSelector } from "@/app/hooks";
import DepositWithdraw from "@/components/common/DepositWithdraw";
import UserLayout from "@/components/layouts/UserLayout";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import BusinessSnapshot from "./BusinessSnapshot/indes";
import Commissions from "./Commissions";
import MyAlert from "./MyAlerts";
import QuickLink from "./QuickLink";
import RankProgress from "./RankProgress";
import TeamGrowthStatistics from "./TeamGrowthStatistics";
import style from "./style.module.scss";
import HPCopyText from "@/components/common/HPCopyText";
import { useEffect } from "react";
import { KEY } from "@/app/constants/request";
import { EUserRole } from "@/interfaces/user";
import { userServices } from "@/service/userService";
import classNames from "classnames";

export default function DashboardUserPage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.user);

  const visitorKey = localStorage.getItem(KEY.VISITOR_KEY);

  useEffect(() => {
    if (visitorKey && user?.role !== EUserRole.admin) {
      const setVisitorKey = async () => {
        const [res, error] = await userServices.setUserVisitorKey(
          visitorKey as string
        );
      };
      setVisitorKey();
    }
  }, [visitorKey, user]);

  return (
    <>
      <div className={style.dashboardUser}>
        <div className={style.dashboardUser__wrapSection}>
          <Row gutter={[30, 30]}>
            <Col span={14} xs={24} md={14}>
              <div className={style.estimateBalance}>
                <div className={style.header}>
                  <span className={style.title}>
                    {t("dashboardUser.balance.title")}
                  </span>
                  <div className={style.action}>
                    <DepositWithdraw />
                  </div>
                </div>
                <div className={style.content}>
                  {/* <span className={style.coin}>
                      {takeDecimalNumber(user?.balance ?? 0, 6)} BTC
                    </span>{" "} */}
                  {" ~ "}
                  <span className={style.dollar}>
                    ${takeDecimalNumber(user?.balance ?? 0, 6)}
                  </span>
                </div>
              </div>
            </Col>
            <Col span={10} xs={24} md={10}>
              <div className={style.infoUser}>
                <div>
                  <span>{user?.name}</span>
                </div>
                <div>
                  <span>{t("dashboardUser.infoUser.textRefCode")}</span>
                  <span className={style.refCode}>
                    {user?.refCode ? (
                      <>
                        {user?.refCode}
                        <HPCopyText content={user?.refCode?.toString?.()} />
                      </>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
                <div>
                  <span>{t("dashboardUser.infoUser.textRewardPoint")}</span>
                  {user?.point && <span>{user.point}</span>}
                </div>
                <div>
                  <span>{t("dashboardUser.infoUser.textRank")}</span>
                  {/* <span>{user?.rank ? user.rank : "N/A"}</span> */}
                  <span>Promoter</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={style.dashboardUser__wrapSection}>
          <Row>
            <Col span={24}>
              <QuickLink />
            </Col>
          </Row>
        </div>
        <Row gutter={[30, 0]}>
          <Col span={8} xs={24} md={12} lg={8}>
            <Row gutter={[0, 40]} className={style.rowRight}>
              <Col span={24}>
                <RankProgress />
              </Col>
              <Col span={24}>
                <TeamGrowthStatistics />
              </Col>
              <Col span={24}>
                <Commissions />
              </Col>
            </Row>
          </Col>
          <Col span={16} xs={24} md={12} lg={16}>
            <Row gutter={[0, 40]} className={style.rowLeft}>
              <Col span={24}>
                <BusinessSnapshot />
              </Col>
              <Col span={24}>
                <MyAlert />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

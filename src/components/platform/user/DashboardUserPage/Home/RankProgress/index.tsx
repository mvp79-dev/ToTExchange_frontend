import InputNormal from "@/components/common/Inputs/InputNormal";
import { LeftOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import style from "./style.module.scss";
import HPCarousel from "@/components/common/HPCarousel";
import HPProgress from "@/components/common/HPProgress";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import classNames from "classnames";
import { useAppSelector } from "@/app/hooks";

interface CarouselProgress {
  percent: number;
}

enum ETabRankDashboard {
  current = "current",
  last = "last",
  highest = "highest",
}

export default function RankProgress() {
  const { user } = useAppSelector((state) => state.user);
  const { t } = useTranslation();
  const dataCarouselProgress: CarouselProgress[] = [
    { percent: 100 },
    { percent: 52 },
    { percent: 48 },
    { percent: 78 },
  ];
  const [activeSearch, setActiveSearch] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ETabRankDashboard>(
    ETabRankDashboard.current
  );
  const tabs = [
    {
      label: t("dashboardUser.rankProgress.labelTabCurrent"),
      key: ETabRankDashboard.current,
    },
    {
      label: t("dashboardUser.rankProgress.labelTabLast"),
      key: ETabRankDashboard.last,
    },
    {
      label: t("dashboardUser.rankProgress.labelTabHighest"),
      key: ETabRankDashboard.highest,
    },
  ];

  return (
    <div className={style.rankProgress}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <div className={style.wrapTop}>
            <div>
              <h4 className={style.title}>
                {t("dashboardUser.rankProgress.title")}
              </h4>
              {/* <span className={style.lastDate}>
                {t("dashboardUser.rankProgress.textDate")}: 08/15/2023, 1:04 PM
              </span> */}
            </div>
            <div>
              <SearchOutlined onClick={() => setActiveSearch(!activeSearch)} />
            </div>
          </div>
        </Col>
        {activeSearch && (
          <Col span={24}>
            <InputNormal
              name="search"
              value=""
              onChange={() => {}}
              prefix={<SearchOutlined />}
              placeholder="Search"
            />
          </Col>
        )}
        <Col span={24} className={style.tab}>
          {tabs.map((tab) => (
            <div
              className={tab.key === activeTab ? style.tabActive : ""}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </Col>
        <Col span={24}>
          {activeTab === ETabRankDashboard.current ? (
            <HPCarousel
              arrows={true}
              prevArrow={<LeftOutlined />}
              nextArrow={<RightOutlined />}
            >
              {dataCarouselProgress.map((data, index) => (
                <div className={style.progressItem} key={index}>
                  <HPProgress
                    percent={data.percent}
                    format={(percent) => (
                      <div className={style.formatProgress}>
                        <span className={style.value}>{percent}% </span>
                        <span className={style.name}>Complete</span>
                      </div>
                    )}
                    styleCss={{ width: 200, height: 200 }}
                  />
                  {/* <span>{user?.rank || "N/A"}</span> */}
                  <span>Promoter</span>
                  <Button className="ant-btn-custom">
                    {t("dashboardUser.rankProgress.textBtn")}
                  </Button>
                </div>
              ))}
            </HPCarousel>
          ) : (
            <div className={classNames(style.progressItem, style.oneProgress)}>
              <HPProgress
                percent={12}
                format={(percent) => (
                  <div className={style.formatProgress}>
                    <span className={style.value}>{percent}% </span>
                    <span className={style.name}>Complete</span>
                  </div>
                )}
                styleCss={{ width: 200, height: 200 }}
              />
              {/* <span>{user?.rank || "N/A"}</span> */}
              <span>Promoter</span>
              <Button className="ant-btn-custom">
                {t("dashboardUser.rankProgress.textBtn")}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

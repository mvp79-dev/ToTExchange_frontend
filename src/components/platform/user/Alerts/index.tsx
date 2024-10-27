import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import RegisterAffiliateBanner from "../../product/shared/RegisterAffiliate";
import { useTranslation } from "react-i18next";
import AllALert from "./AllAlert";
import { IAlertCount } from "@/interfaces/alert";
import { alertService } from "@/service/alertService";

import styles from "./style.module.scss";

const DEFAULT_COUNT = 0;

enum EKeyTab {
  "allAlert" = "all-alert",
  "commissions" = "commissions",
  "repOrder" = "rep-order",
  "repSignup" = "rep-signup",
  "celebration" = "celebration",
}

export default function Alerts() {
  const [tabActive, setTabActive] = useState<EKeyTab>(EKeyTab.allAlert);
  const [alertCount, setAlertCount] = useState<IAlertCount[]>();
  const { t } = useTranslation();

  const renderAlertNumber = useCallback(
    (type: EKeyTab): number => {
      switch (type) {
        case EKeyTab.allAlert:
          return (
            alertCount?.reduce(
              (accumulator, currentValue) => accumulator + currentValue.count,
              0
            ) || DEFAULT_COUNT
          );
        case EKeyTab.commissions:
          return DEFAULT_COUNT;
        default:
          return DEFAULT_COUNT;
      }
    },
    [alertCount]
  );

  useEffect(() => {
    (async () => {
      const result = await alertService.getAlertCount();
      setAlertCount(result);
    })();
  }, []);
  const tabs = useMemo(
    () => [
      {
        key: EKeyTab.allAlert,
        label: `${t("alerts.tabs.item1")} `,
      },
      {
        key: EKeyTab.commissions,
        label: `${t("alerts.tabs.item2")} `,
      },
      // {
      //   key: EKeyTab.repOrder,
      //   label: `${t("alerts.tabs.item3")} (04)`,
      // },
      // {
      //   key: EKeyTab.repSignup,
      //   label: `${t("alerts.tabs.item4")} (04)`,
      // },
      // {
      //   key: EKeyTab.celebration,
      //   label: `${t("alerts.tabs.item5")} (04)`,
      // },
    ],
    [t]
  );
  return (
    <>
      <div className={styles.alerts}>
        <div className={styles.alerts__left}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={classNames({
                [styles.activeMenu]: tab.key === tabActive,
              })}
              onClick={() => setTabActive(tab.key)}
            >
              {tab.label} {`(${renderAlertNumber(tab.key)})`}
            </div>
          ))}
        </div>
        <div className={styles.alerts__content}>
          {tabActive === EKeyTab.allAlert ? <AllALert /> : <div></div>}
        </div>
      </div>
      <RegisterAffiliateBanner />
    </>
  );
}

import UserLayout from "@/components/layouts/UserLayout";
import styles from "./style.module.scss";
import classNames from "classnames";
import { useState } from "react";
import AllOrder from "./components/AllOrder";
import RegisterAffiliateBanner from "../../product/shared/RegisterAffiliate";
import { useTranslation } from "react-i18next";

enum EKeyTab {
  "allOrder" = "all-order",
  "personalOrder" = "personal-order",
  "customerOrders" = "customer-order",
  "subscription" = "Subscription",
}
export enum EMyOrderStatus {
  complete = "complete",
  verified = "verified",
  shipping = "shipping",
  departed = "departed",
}

export default function MyOrder() {
  const [tabActive, setTabActive] = useState<EKeyTab>(EKeyTab.allOrder);
  const { t } = useTranslation();
  const tabs: { label: string; key: EKeyTab }[] = [
    {
      key: EKeyTab.allOrder,
      label: t("myOrder.allOrder.title"),
    },
    // {
    //   key: EKeyTab.personalOrder,
    //   label: t("myOrder.personalOrder.title"),
    // },
    // {
    //   key: EKeyTab.customerOrders,
    //   label: t("myOrder.customerOrder.title"),
    // },
    // {
    //   key: EKeyTab.subscription,
    //   label:  t("myOrder.subscription.title"),
    // },
  ];
  return (
    <UserLayout>
      <div className={styles.myOrderPage}>
        <div className={styles.myOrderPage__left}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={classNames(tab.key === tabActive && styles.activeMenu)}
              onClick={() => setTabActive(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className={styles.myOrderPage__content}>
          {tabActive === EKeyTab.allOrder ? <AllOrder /> : <div></div>}
        </div>
      </div>
      <RegisterAffiliateBanner />
    </UserLayout>
  );
}

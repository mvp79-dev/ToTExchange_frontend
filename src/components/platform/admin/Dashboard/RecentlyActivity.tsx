import HPSelect from "@/components/common/Inputs/HPSelect";
import style from "./style.module.scss";
import { RiseOutlined } from "@ant-design/icons";
import IconEnrollDistributor from "@/assets/icons/enrollDistributor.svg";
import iconDeliveryOrder from "@/assets/icons/icon-delivery-2.svg";
import IconCart from "@/assets/icons/iconCart_2.svg";
import IconSetting from "@/assets/icons/icon-setting.svg";
import { useEffect, useState } from "react";
import { adminService } from "@/service/adminService";
import { EPackageTimeTypeParam } from "@/service/chartService";
import { IRecentlyActivityResponse } from "@/interfaces/admin";
import { selectDurationOptions } from "@/app/common/selectOptions";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
type Props = {};

const calculatePercent = (present: number, previous: number) => {
  const increase = present - previous;
  if (present === previous) {
    return 0;
  }
  if (previous === 0) {
    return 100;
  }

  const percent = (increase / previous) * 100;
  return percent.toFixed(2);
};

const activityList = (
  data: IRecentlyActivityResponse | undefined,
  t: TFunction<"translation", undefined>
) => {
  return [
    {
      bgColor: "#DCFCE7",
      iconColor: "#52C41A",
      label: t("adminRecentlyActivity.totalCustomer"),
      value: data?.totalUser.present,
      growth: calculatePercent(
        Number(data?.totalUser.present),
        Number(data?.totalOrder.previous)
      ),
      icon: <img src={IconEnrollDistributor} />,
    },
    {
      bgColor: "#FFF4DE",
      iconColor: "#FAAD14",
      label: t("adminRecentlyActivity.visitor"),
      value: data?.visitors.present,
      growth: calculatePercent(
        Number(data?.visitors.present),
        Number(data?.visitors.previous)
      ),
      icon: <img src={IconSetting} />,
    },
    {
      bgColor: "#FFECEE",
      iconColor: "#F5222D",
      label: t("adminRecentlyActivity.totalDelivery"),
      value: data?.totalOrderSuccess.present,
      growth: calculatePercent(
        Number(data?.totalOrderSuccess.present),
        Number(data?.totalOrderSuccess.previous)
      ),
      icon: <img src={iconDeliveryOrder} />,
    },
    {
      bgColor: "#E6F4FF",
      iconColor: "#1677FF",
      label: t("adminRecentlyActivity.totalOrder"),
      value: data?.totalOrder.present,
      growth: calculatePercent(
        Number(data?.totalOrder.present),
        Number(data?.totalOrder.previous)
      ),
      icon: <img src={IconCart} />,
    },
  ];
};
export default function RecentlyActivity() {
  const { t } = useTranslation();
  const [data, setData] = useState<IRecentlyActivityResponse>();
  const [selected, setSelected] = useState<EPackageTimeTypeParam>(
    EPackageTimeTypeParam.by_week
  );
  useEffect(() => {
    (async () => {
      const res = await adminService.getRecentlyActivity(selected);
      setData(res);
    })();
  }, [selected]);
  return (
    <div className={style.recentlyActivity}>
      <div className={style.filter}>
        <span>{t("adminRecentlyActivity.title")}</span>
        <HPSelect
          options={selectDurationOptions(t)}
          onChange={(value: string) => {
            setSelected(value as EPackageTimeTypeParam);
          }}
          value={selected}
        />
      </div>
      <div className={style.boxActivity}>
        {activityList(data, t).map((el, index) => (
          <div
            className={style.boxActivity__item}
            style={{ backgroundColor: el.bgColor }}
            key={index}
          >
            <div
              className={style["boxActivity__item-icon"]}
              style={{ backgroundColor: el.iconColor }}
            >
              {el.icon}
            </div>
            <div className={style["boxActivity__item-content"]}>
              <div className={style["boxActivity__item-content__growth"]}>
                <span>{el.label}</span>
                <div
                  className={style["boxActivity__item-content__growth-value"]}
                >
                  <span>{el.growth}%</span>
                  <RiseOutlined style={{ color: el.iconColor }} />
                </div>
              </div>
              <div className={style["boxActivity__item-content__value"]}>
                {el.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

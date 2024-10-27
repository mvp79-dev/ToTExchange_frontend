import HPRangePicker from "@/components/common/Inputs/HPRangePicker";
import { IQuerySnapshot } from "@/interfaces/common";
import { IBusinessSnapshot } from "@/interfaces/user";
import { userServices } from "@/service/userService";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

interface ISnapshot {
  label: string;
  key: string;
}

export default function BusinessSnapshot() {
  const { t } = useTranslation();
  const dataSnapshots: ISnapshot[] = [
    {
      label: t("dashboardUser.businessSnapshot.textWeeklyLeftLeg"),
      key: "leftLegWeeklyCommissionAmount",
    },
    {
      label: t("dashboardUser.businessSnapshot.textWeeklyRightLeg"),
      key: "rightLegWeeklyCommissionAmount",
    },
    {
      label: t(
        "dashboardUser.businessSnapshot.textWeeklyPersonallySponsoredLeftLeg"
      ),
      key: "personallySponsoredActiveAmountInLeftLeg",
    },
    {
      label: t(
        "dashboardUser.businessSnapshot.textWeeklyPersonallySponsoredRightLeg"
      ),
      key: "personallySponsoredActiveAmountInRightLeg",
    },
  ];

  const [dataSnapshot, setDataSnapshot] = useState<IBusinessSnapshot>();

  const [params, setParams] = useState<IQuerySnapshot>({
    startTime: 0,
    endTime: Date.now(),
  });

  const getBusinessSnapshot = useCallback(async () => {
    const [res, error] = await userServices.getBusinessSnapshot(params);
    if (res) {
      setDataSnapshot(res.data);
    }
  }, [params]);

  useEffect(() => {
    getBusinessSnapshot();
  }, [getBusinessSnapshot]);

  const handleRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    const startTime = dayjs(dateStrings[0]).valueOf();
    const endTime = dayjs(dateStrings[1]).valueOf();
    if (!startTime || !endTime) {
      setParams({ startTime: 0, endTime: Date.now() });
    } else {
      setParams({ startTime, endTime });
    }
  };

  return (
    <div className={style.businessSnapshot}>
      <div className={style.header}>
        <div className={style.title}>
          <div>{t("dashboardUser.businessSnapshot.title")}</div>
          {/* <span>
            {t("dashboardUser.businessSnapshot.textDate")}: 08/15/2023, 1:04 PM
          </span> */}
        </div>
        <div className={style.action}>
          <HPRangePicker onRangeChange={handleRangeChange} />
        </div>
      </div>
      <div className={style.snapshotList}>
        {dataSnapshots.map((data, index) => (
          <div className={style.snapshotItem} key={index}>
            <div className={style.label}>
              <span>{data.label}</span>
              {/* {data.action && <img src={IconExport} alt="" />} */}
            </div>
            <span className={style.value}>
              {dataSnapshot?.[data.key as keyof IBusinessSnapshot]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

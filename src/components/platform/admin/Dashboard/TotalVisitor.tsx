import HPSelect, { IOpionsHPSelect } from "@/components/common/Inputs/HPSelect";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import SimpleLineChart, {
  IDataSimpleLineChart,
} from "../Charts/SimpleLineChart";
import { EPackageTimeTypeParam, chartServices } from "@/service/chartService";
import { ITotalVisitorChart } from "@/interfaces/chart";
import { selectDurationOptions } from "@/app/common/selectOptions";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

type Props = {};

export default function TotalVisitor() {
  const { t } = useTranslation();
  const [data, setData] = useState<ITotalVisitorChart[]>([]);
  const [selected, setSelected] = useState<EPackageTimeTypeParam>(
    EPackageTimeTypeParam.by_week
  );

  useEffect(() => {
    (async () => {
      const res = await chartServices.getTotalVisitorChart(selected);
      setData(res);
    })();
  }, [selected]);

  return (
    <div className={style.totalVisitor}>
      <div className={style.filter}>
        <span>{t("adminDashboard.totalVisitor")}</span>
        <HPSelect
          options={selectDurationOptions(t)}
          onChange={(value: string) => {
            setSelected(value as EPackageTimeTypeParam);
          }}
          value={selected}
        />
      </div>
      <div className={style.chart}>
        <SimpleLineChart
          data={
            data.map((item) => {
              return {
                name: dayjs(item.onDate).format("D MMM"),
                value1: item.userVistor,
                value2: item.guestVistor,
              };
            }) as any
          }
          legends={["User Visitor", "Guess Visitor"]}
        />
      </div>
    </div>
  );
}

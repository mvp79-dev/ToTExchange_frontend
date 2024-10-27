import HPSelect from "@/components/common/Inputs/HPSelect";
import style from "./style.module.scss";
import StackedAreaChart from "../Charts/StackedAreaChart";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { EPackageTimeTypeParam, chartServices } from "@/service/chartService";
import { ISaleChart } from "@/interfaces/chart";
import dayjs from "dayjs";
import { selectDurationOptions } from "@/app/common/selectOptions";

export default function TotalSale() {
  const { t } = useTranslation();
  const [data, setData] = useState<ISaleChart[]>([]);

  const [selected, setSelected] = useState<EPackageTimeTypeParam>(
    EPackageTimeTypeParam.by_week
  );
  useEffect(() => {
    (async () => {
      const res = await chartServices.getSaleChartInfo(selected);
      setData(res);
    })();
  }, [selected]);

  return (
    <div className={style.totalSale}>
      <div className={style.filter}>
        <span>{t("adminDashboard.totalSale")}</span>
        <HPSelect
          options={selectDurationOptions(t)}
          onChange={(value: string) => {
            setSelected(value as EPackageTimeTypeParam);
          }}
          value={selected}
        />
      </div>
      <div className={style.chart}>
        <StackedAreaChart
          data={
            data.map((item) => {
              return {
                name: dayjs(item.date).format("D MMM"),
                value1: item.productSaleTotalAmount,
                value2: item.nftSaleTotalAmount,
              };
            }) as any
          }
          color1="#FAAD14"
          color2="#0958D9"
          legends={["Product", "NFT"]}
        />
      </div>
    </div>
  );
}

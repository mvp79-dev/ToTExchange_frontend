import HPSelect from "@/components/common/Inputs/HPSelect";
import style from "./style.module.scss";
import SimpleBarChart from "../Charts/SimpleBarChart";
import { useEffect, useState } from "react";
import { EPackageTimeTypeParam, chartServices } from "@/service/chartService";
import { useTranslation } from "react-i18next";
import { IRevenueChart } from "@/interfaces/chart";
import dayjs from "dayjs";
import { selectDurationOptions } from "@/app/common/selectOptions";

export default function TotalRevenue() {
  const { t } = useTranslation();
  const [data, setData] = useState<IRevenueChart[]>([]);

  const [selected, setSelected] = useState<EPackageTimeTypeParam>(
    EPackageTimeTypeParam.by_week
  );

  useEffect(() => {
    (async () => {
      const res = await chartServices.getRevenueChartInfo(selected);
      setData(res);
    })();
  }, [selected]);

  return (
    <div className={style.totalRevenue}>
      <div className={style.filter}>
        <span>{t("adminDashboard.totalRevenue")}</span>
        <HPSelect
          options={selectDurationOptions(t)}
          onChange={(value: string) => {
            setSelected(value as EPackageTimeTypeParam);
          }}
          value={selected}
        />
      </div>
      <div className={style.chart}>
        <SimpleBarChart
          data={
            data.map((item) => {
              return {
                name: dayjs(item.date).format("D MMM"),
                value1: item.productRevenueTotalAmount,
                value2: item.nftRevenueTotalAmount,
              };
            }) as any
          }
          legend={["Product", "NFT"]}
          color1={"#FAAD14"}
          color2={"#9DCA00"}
        />
      </div>
    </div>
  );
}

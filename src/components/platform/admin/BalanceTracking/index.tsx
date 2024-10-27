import AdminLayout from "@/components/layouts/AdminLayout";
import EstimateBalance from "./EstimateBalance";
import style from "./style.module.scss";
import { Col, Row } from "antd";
import StackedAreaChart from "../Charts/StackedAreaChart";
import HPSelect from "@/components/common/Inputs/HPSelect";
import TransactionHistory from "./TransactionHistory";
import WithdrawalOrder from "./WithdrawalOrder";
import { useEffect, useState } from "react";
import { EPackageTimeTypeParam, chartServices } from "@/service/chartService";
import { ITotalVolumeChart } from "@/interfaces/chart";
import dayjs from "dayjs";
import { selectDurationOptions } from "@/app/common/selectOptions";
import { useTranslation } from "react-i18next";

export default function BalanceTrackingManagement() {
  const { t } = useTranslation();
  const [data, setData] = useState<ITotalVolumeChart[]>([]);

  const [selected, setSelected] = useState<EPackageTimeTypeParam>(
    EPackageTimeTypeParam.by_week
  );

  useEffect(() => {
    (async () => {
      const res = await chartServices.getTotalVolumeChart(selected);
      setData(res);
    })();
  }, [selected]);

  return (
    <AdminLayout>
      <div className={style.balanceTracking}>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <EstimateBalance />
          </Col>
          <Col span={12}>
            <div className={style.areaChart}>
              <div className={style.filter}>
                <span>{t("estimateBalance.totalVolume")}</span>
                <HPSelect
                  options={selectDurationOptions(t)}
                  onChange={(value) =>
                    setSelected(value as EPackageTimeTypeParam)
                  }
                  value={selected}
                />
              </div>
              <div className={style.chart}>
                <StackedAreaChart
                  data={
                    data.map((item) => {
                      return {
                        name: dayjs(item.onDate).format("D MMM"),
                        value1: item.depositTotal,
                        value2: item.withdrawTotal,
                      };
                    }) as any
                  }
                  color1="#FAAD14"
                  color2="#9DCA00"
                  legends={[
                    t("estimateBalance.Deposit Total"),
                    t("estimateBalance.Withdraw Total"),
                  ]}
                />
              </div>
            </div>
          </Col>
        </Row>
        <TransactionHistory />
        <WithdrawalOrder />
      </div>
    </AdminLayout>
  );
}

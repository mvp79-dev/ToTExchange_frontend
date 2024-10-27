import { IOpionsHPSelect } from "@/components/common/Inputs/HPSelect";
import { EPackageTimeTypeParam } from "@/service/chartService";
import { TFunction } from "i18next";

export const selectDurationOptions = (
  t: TFunction<"translation", undefined>
): IOpionsHPSelect[] => {
  return [
    {
      label: t("chartSelection.thisWeek"),
      value: EPackageTimeTypeParam.by_week,
    },
    {
      label: t("chartSelection.thisMonth"),
      value: EPackageTimeTypeParam.by_month,
    },
    {
      label: t("chartSelection.thisYear"),
      value: EPackageTimeTypeParam.by_year,
    },
    {
      label: t("chartSelection.bySixMonth"),
      value: EPackageTimeTypeParam.by_six_month,
    },
  ];
};

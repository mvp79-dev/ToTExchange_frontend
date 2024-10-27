import request from "./request";

export enum EPackageTimeTypeParam {
  by_week = "by_week",
  by_month = "by_month",
  by_year = "by_year",
  by_six_month = "by_six_month",
}

class ChartServices {
  async getRevenueChartInfo(packageTimeType: EPackageTimeTypeParam) {
    const { data } = await request.get("/admin/revenue-chart", {
      packageTimeType,
    });
    return data?.data;
  }

  async getSaleChartInfo(packageTimeType: EPackageTimeTypeParam) {
    const { data } = await request.get("/admin/sale-chart", {
      packageTimeType,
    });
    return data?.data;
  }
  async getTotalVolumeChart(packageTimeType: EPackageTimeTypeParam) {
    const { data } = await request.get("/admin/totalVolume-chart", {
      packageTimeType,
    });
    return data?.data;
  }

  async getTotalVisitorChart(packageTimeType: EPackageTimeTypeParam) {
    const { data } = await request.get("/admin/totalVisitor-chart", {
      packageTimeType,
    });
    return data?.data;
  }
}

export const chartServices = new ChartServices();

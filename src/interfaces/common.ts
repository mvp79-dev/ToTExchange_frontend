import { EPackageTimeTypeParam } from "@/service/chartService";
import { Dayjs } from "dayjs";
import { ReactNode } from "react";

export interface IResponseArray<T> {
  data: T[];
  meta: {
    totalPages: number;
    count: number;
  };
}

export interface IQuery {
  page: number;
  size: number;
  sort_by?: string;
  order_by?: "asc" | "desc";
  filter?: string;
  status?: string;
  createdAt_lte?: Date | string | Dayjs;
  createdAt_gte?: Date | string | Dayjs;
  packageTimeType?: EPackageTimeTypeParam;
}

export interface IQuerySnapshot {
  startTime: number;
  endTime: number;
}

export enum EKeyTranslations {
  en = "en",
  vi = "vi",
}

export interface IColumn {
  title: string | ReactNode;
  dataIndex?: string;
  render?: any;
  key?: string;
  fixed?: any;
  width?: number | string;
  sorter?: (a: any, b: any) => any;
  align?: "center" | "left" | "right";
}

export interface IBreadcrumb {
  label: string;
  link: string;
  isActive: boolean;
}

export interface IUserConfig {
  TOTAL_WITHDRAW_PER_DAY: string;
  MIN_WITHDRAW: string;
  WITHDRAW_FEE: string;
}

export enum EKeySearchUrlRegister {
  referralCode = "referralCode",
  direction = "direction",
}

export interface IHeaderMenu {
  title: string | ReactNode;
  link: string;
  subMenu?: boolean | Array<{ label: string; key: string }>;
}

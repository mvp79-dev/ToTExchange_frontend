export enum IToastPosition {
  "bottom-right" = "bottom-right",
  "top-right" = "top-right",
  "bottom-left" = "bottom-left",
  "top-left" = "top-left",
}

export enum EToastType {
  success = "success",
  error = "error",
  info = "info",
  warning = "warning",
}

export interface IToastCustom {
  id: number;
  message: string;
  type: EToastType;
}

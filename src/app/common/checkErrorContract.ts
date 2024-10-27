import { TFunction } from "i18next";
import { toast } from "react-toastify";

export const checkErrorContract = (
  t: TFunction<"translation", undefined>,
  error: any
) => {
  if (error.code === -32603) {
    toast.error(t("toastErrorCommon.Message-1.2"));
  } else if (error.message === "User rejected request") {
    toast.error(t("toastErrorCommon.Message-1.1"));
  } else if (error.code === -32002) {
    toast.error(t("toastErrorCommon.Message-1.4"));
  } else {
    toast.error(t("toastErrorCommon.Message-1.3"));
  }
};

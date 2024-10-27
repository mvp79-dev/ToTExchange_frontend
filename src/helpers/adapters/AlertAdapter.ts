import { EFormatDate } from "@/app/common/formatDate";
import { EAlertType, IAlert } from "@/interfaces/alert";
import dayjs from "dayjs";
import { orderAdapter } from "./OrderAdapter";
import _ from "lodash";
import IconNewCustomer from "@/assets/icons/enrollDistributor.svg";
import IconWallet from "@/assets/icons/iconWallet.svg";
import IconGift from "@/assets/icons/iconGift.svg";
import IconCart from "@/assets/icons/iconCart_2.svg";
import { TFunction } from "i18next";

class AlertAdapter {
  public alertColor = {
    [EAlertType.REP_ORDER]: "#52C41A",
    [EAlertType.REP_SIGNUP]: "#9DCA00",
    [EAlertType.COMMISSIONS]: "#1677FF",
    [EAlertType.CELEBRATION]: "#F5222D",
  };
  convertContentAlertItem(
    data: IAlert,
    t: TFunction<"translation", undefined>,
  ) {
    switch (data?.type) {
      case EAlertType.REP_ORDER:
        return t(`alerts.alertOderItem.content`, {
          orderId: data?.order?.orderCustomId,
          date: dayjs(data?.order?.createAt).format(EFormatDate["MM-DD-YYYY"]),
          orderStatus: _.lowerCase(
            orderAdapter.mappingStatusOrder(data?.orderStatus as number, t),
          ),
        });
      case EAlertType.REP_SIGNUP:
        return t("alerts.alertSignUpItem.content", {
          nameRef: data?.nameRef || "",
          emailRef: data?.emailRef || "",
        });
      case EAlertType.COMMISSIONS:
        return t("alerts.alertCommissionItem.content", {
          fromDate: dayjs(data.fromDate).format(EFormatDate["MM-DD-YYYY"]),
          toDate: dayjs(data.toDate).format(EFormatDate["MM-DD-YYYY"]),
          amount: data?.amount,
        });
      case EAlertType.CELEBRATION:
        return t("alerts.alertCommissionItem.content", {
          renewOn: dayjs(data.renewOn).format(EFormatDate["MM-DD-YYYY"]),
        });
      default:
        return "";
    }
  }
  convertTitleAlertItem(data: IAlert, t: TFunction<"translation", undefined>) {
    switch (data.type) {
      case EAlertType.REP_ORDER:
        return t("alerts.alertOderItem.title", {
          orderStatus: _.lowerCase(
            orderAdapter.mappingStatusOrder(data?.orderStatus as number, t),
          ),
        });
      case EAlertType.REP_SIGNUP:
        return t("alerts.alertSignUpItem.title");
      case EAlertType.COMMISSIONS:
        return t("alerts.alertCommissionItem.title", {
          fromDate: dayjs(data.fromDate).format(EFormatDate["MM-DD-YYYY"]),
          toDate: dayjs(data.toDate).format(EFormatDate["MM-DD-YYYY"]),
        });
      case EAlertType.CELEBRATION:
        return t("alerts.alertCelebrationItem.title");
      default:
        return "";
    }
  }
  renderIconAlertItem(type: EAlertType) {
    switch (type) {
      case EAlertType.REP_ORDER:
        return IconCart;
      case EAlertType.REP_SIGNUP:
        return IconNewCustomer;
      case EAlertType.CELEBRATION:
        return IconGift;
      case EAlertType.COMMISSIONS:
        return IconWallet;
      default:
        return IconCart;
    }
  }
  convertDataAlertResponseApi(
    data: IAlert,
    t: TFunction<"translation", undefined>,
  ) {
    return {
      label: this.convertTitleAlertItem(data, t),
      date: dayjs(data.createdAt).format(EFormatDate["MM/DD/YYYY  h:mm A"]),
      content: this.convertContentAlertItem(data, t),
      color: this.alertColor[data.type],
      icon: this.renderIconAlertItem(data.type),
      action: data.type,
      orderCustomId: data?.order?.orderCustomId || "",
      orderId: data?.orderId || "",
      nameRef: data.nameRef || "",
      emailRef: data.emailRef || "",
      type: data.type,
    };
  }
}

export const alertDataAdapter = new AlertAdapter();

import { EFormatDate } from "@/app/common/formatDate";
import {
  ETotalVolumeAction,
  EWithDrawStatus,
  ITolaVolumeItem,
  IWithdrawItem,
} from "@/interfaces/admin";
import dayjs from "dayjs";
import { TFunction } from "i18next";

class AdminDataAdapter {
  convertTotalVolumeFromApi(
    data: ITolaVolumeItem,
    t: TFunction<"translation", undefined>,
    index: number
  ) {
    return {
      id: data.id,
      index: index + 1,
      hash:
        data.action === ETotalVolumeAction.deposit
          ? data.hashCustom
          : data.withDrawRequest?.txHash,
      customer: data.user.userName,
      type: data.action === ETotalVolumeAction.deposit ? "Deposit" : "Withdraw",
      amount: data.amount,
      date: dayjs(data.createdAt).format(EFormatDate["DD/MM/YYYY"]),
    };
  }
  convertWithdrawFromApi(
    data: IWithdrawItem,
    t: TFunction<"translation", undefined>,
    index: number
  ) {
    return {
      id: data.id,
      orderCustomId: data.orderCustomId,
      index: index + 1,
      customer: data.user.userName,
      amount: data.amount,
      date: dayjs(data.createdAt).format(EFormatDate["DD/MM/YYYY"]),
      status: data.status,
      action: {
        id: data.id,
        status: data.status,
      },
    };
  }

  mappingWithdrawStatus(
    status: EWithDrawStatus,
    t: TFunction<"translation", undefined>
  ) {
    switch (status) {
      case EWithDrawStatus.CREATED:
        return t("adminWithdrawStatus.created");
      case EWithDrawStatus.APPROVED:
        return t("adminWithdrawStatus.approved");
      case EWithDrawStatus.PROCESSING:
        return t("adminWithdrawStatus.processing");
      case EWithDrawStatus.REJECTED:
        return t("adminWithdrawStatus.rejected");
      case EWithDrawStatus.FINISHED:
        return t("adminWithdrawStatus.finished");
      default:
        return "";
    }
  }
}

export const adminDataAdapter = new AdminDataAdapter();

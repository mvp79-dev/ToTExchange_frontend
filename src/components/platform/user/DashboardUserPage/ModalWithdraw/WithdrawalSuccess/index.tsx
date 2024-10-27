import { ReactComponent as OrderSuccessImg } from "@/assets/images/order-success.svg";
import { InfoCircleFilled } from "@ant-design/icons";
import { Button, Space } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { IWithdrawForm } from "@/interfaces/withdrawal";
import { withdrawWalletType } from "../WithdrawForm/WalletWithdrawalForm";
import { ERecipientType } from "@/app/constants/withdrawal";
import { useNavigate } from "react-router-dom";
import { ERoutePath } from "@/app/constants/path";
import { EHashProfile } from "../../../Profile/MyProfile/ActivityTimeline";
import { useAppSelector } from "@/app/hooks";

const DEFAULT_WITHDRAW_FEE = 0;

function WithdrawalSuccess({
  formData,
  onClose,
  activeRecipientType,
  isAdmin,
}: {
  formData?: IWithdrawForm;
  onClose: () => void;
  activeRecipientType?: ERecipientType;
  isAdmin: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { userConfigs } = useAppSelector((state) => state.app);

  const withDrawFee = Number(userConfigs?.WITHDRAW_FEE) ?? DEFAULT_WITHDRAW_FEE;

  const handleClick = () => {
    navigate({
      pathname: ERoutePath.PROFILE,
      hash: EHashProfile.activityTimeline,
    });
    onClose();
  };
  return (
    <div className={styles["order-sent"]}>
      <OrderSuccessImg />
      <div className={styles["order-sent__notification"]}>
        <h5>{t("dashboardUser.withdrawal.Withdrawal Order Submited")}</h5>
        <p>
          {t("dashboardUser.withdrawal.Withdrawal request submitted")}.<br />
          {!isAdmin &&
            t(
              "dashboardUser.withdrawal.Visit History to view your order status"
            ) + "."}
        </p>
        <div>
          <p>{t("dashboardUser.withdrawal.Receive amount")}</p>
          <p>
            {Number(
              !activeRecipientType
                ? formData?.walletUser.amount
                : formData?.internalUser.amount
            ) - withDrawFee}{" "}
            {formData?.currency}
          </p>
        </div>
      </div>
      <div className={styles["order-sent__info"]}>
        {formData?.walletUser.withdrawWalletType && (
          <div>
            <p>{t("dashboardUser.withdrawal.Transaction Method")}</p>
            <p>
              {
                withdrawWalletType(t).filter(
                  (el) => el.value === formData?.walletUser.withdrawWalletType
                )[0].label
              }
            </p>
          </div>
        )}
        <div>
          <p>{t("dashboardUser.withdrawal.Indicated Amount")}</p>
          <p>
            {!activeRecipientType
              ? formData?.walletUser.amount
              : formData?.internalUser.amount}{" "}
            {formData?.currency}
          </p>
        </div>
        <div>
          <p>
            <span>{t("dashboardUser.withdrawal.protocolFee")}</span>
            <InfoCircleFilled />
          </p>
          <p>
            {withDrawFee} {formData?.currency}
          </p>
        </div>
      </div>
      {!isAdmin && (
        <Space size={12}>
          {/* <Button
          type="primary"
          className={classNames(
            styles["order-sent__btn"],
            styles["view-wallet"]
          )}
        >
          {t("dashboardUser.withdrawal.View wallet")}
        </Button> */}
          <Button
            type="primary"
            className={classNames(
              styles["order-sent__btn"],
              styles["view-history"]
            )}
            onClick={handleClick}
          >
            {t("dashboardUser.withdrawal.View history")}
          </Button>
        </Space>
      )}
    </div>
  );
}

export default WithdrawalSuccess;

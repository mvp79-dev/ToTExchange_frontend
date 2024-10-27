import HPModal from "@/components/common/HPModal";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import WithdrawForm from "./WithdrawForm";

import { KEY } from "@/app/constants/request";
import { ERecipientType } from "@/app/constants/withdrawal";
import store from "@/app/store";
import HPSteps from "@/components/common/HPSteps";
import { userActions } from "@/features/user/userSlice";
import {
  E_WITHDRAW_TYPE,
  IRequestWithdraw,
  IWithdrawForm,
} from "@/interfaces/withdrawal";
import { ETypeRequestSendOTP, authServices } from "@/service/authServices";
import { userServices } from "@/service/userService";
import { toast } from "react-toastify";
import OTPVerification from "./OTPVerification";
import WithdrawalSuccess from "./WithdrawalSuccess";
import styles from "./styles.module.scss";
import { accuratelyTakeDecimalNumber } from "@/app/common/helper";
import { adminService } from "@/service/adminService";

interface IProps {
  open: boolean;
  isAdmin: boolean;
  overideBalance: number;
  onClose: () => void;
}

enum EWithdrawStep {
  ENTER_WITHDRAW_AMOUNT,
  VERIFICATION,
  ORDER_SENT,
}

function ModalWithdraw({ onClose, open, isAdmin, overideBalance }: IProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<EWithdrawStep>(
    EWithdrawStep.ENTER_WITHDRAW_AMOUNT
  );
  const [formData, setFormData] = useState<IWithdrawForm>();
  const [processingVerify, setProcessingVerify] = useState<boolean>(false);
  const [processingSendOTP, setProcessingSendOTP] = useState<boolean>(false);
  const [activeRecipientType, setActiveRecipientType] = useState<
    ERecipientType | undefined
  >();

  const proceedToOTPVerification = useCallback(async (form: IWithdrawForm) => {
    const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!accessToken) return;
    setProcessingSendOTP(true);
    setFormData(form);

    const [resOTP, errorOTP] = await authServices.requestResendOtp({
      type: ETypeRequestSendOTP.confirm_withdraw,
      normalToken: accessToken,
    });
    if (errorOTP) {
      setProcessingSendOTP(false);
      toast.error("Error");
    } else {
      setProcessingSendOTP(false);
      setCurrentStep(EWithdrawStep.VERIFICATION);
    }
  }, []);

  const handleVerifyOTP = async (otp: number) => {
    if (!formData) return;
    setProcessingVerify(true);
    const { walletUser, internalUser } = formData;

    const sendForm: IRequestWithdraw | Omit<IRequestWithdraw, "type"> = isAdmin
      ? {
          amount: accuratelyTakeDecimalNumber(Number(walletUser.amount)),
          otp: Number(otp),
          receiverAddress: walletUser.walletAddress,
          network: "",
          tokenAddress: "",
        }
      : {
          amount: Number(
            activeRecipientType
              ? accuratelyTakeDecimalNumber(Number(internalUser.amount))
              : accuratelyTakeDecimalNumber(Number(walletUser.amount))
          ),
          otp: Number(otp),
          type: !activeRecipientType
            ? E_WITHDRAW_TYPE.TO_EXTERNAL_WALLET
            : E_WITHDRAW_TYPE.TRANSFER_TO_USER,
          receiverAddress: activeRecipientType ? "" : walletUser.walletAddress,
          network: "",
          tokenAddress: "",
          receiverEmail:
            activeRecipientType === ERecipientType.EMAIL
              ? internalUser.recipient
              : "",
          receiverId:
            activeRecipientType === ERecipientType.ID
              ? Number(internalUser.recipient)
              : undefined,
        };

    let error: any;

    if (isAdmin) {
      [, error] = await adminService.createWithdraw(sendForm);
    } else {
      [, error] = await userServices.requestWithdraw(
        sendForm as IRequestWithdraw
      );
    }

    if (error) {
      setProcessingVerify(false);
      toast.error(error.data.message);
    } else {
      setProcessingVerify(false);
      store.dispatch(userActions.getUserInfoRequest());
      store.dispatch(userActions.getInfoWithdrawToDayRequest());
      setCurrentStep(EWithdrawStep.ORDER_SENT);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!token) return;
    store.dispatch(userActions.getUserInfoRequest());
  }, []);

  return (
    <HPModal
      open={open}
      width={768}
      title={null}
      footer={null}
      className={styles["withdrawal-modal"]}
      onClose={onClose}
    >
      <HPSteps
        className={styles["withdrawal-modal__withdraw-steps"]}
        activeStep={currentStep}
        dataStep={[
          {
            title: t("cart.Select currency"),
          },
          {
            title: t("dashboardUser.withdrawal.Enter OTP"),
          },
          {
            title: t("cart.Successful"),
          },
        ]}
      />
      {currentStep === EWithdrawStep.ENTER_WITHDRAW_AMOUNT && (
        <WithdrawForm
          isAdmin={isAdmin}
          overideBalance={overideBalance}
          onProceedToVerification={proceedToOTPVerification}
          processingSendOTP={processingSendOTP}
          activeRecipientType={activeRecipientType}
          setActiveRecipientType={(type) => setActiveRecipientType(type)}
        />
      )}
      {currentStep === EWithdrawStep.VERIFICATION && (
        <OTPVerification
          handleVerifyOTP={handleVerifyOTP}
          processingVerify={processingVerify}
        />
      )}
      {currentStep === EWithdrawStep.ORDER_SENT && (
        <WithdrawalSuccess
          isAdmin={isAdmin}
          formData={formData}
          onClose={onClose}
          activeRecipientType={activeRecipientType}
        />
      )}
    </HPModal>
  );
}

export default ModalWithdraw;

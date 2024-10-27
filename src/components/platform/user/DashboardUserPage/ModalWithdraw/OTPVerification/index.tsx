import { KEY } from "@/app/constants/request";
import VerifyOTP from "@/components/platform/auth/VerifyOTP";
import { ETypeRequestSendOTP, authServices } from "@/service/authServices";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

type Props = {
  handleVerifyOTP: (otp: number) => void;
  processingVerify: boolean;
};

function OTPVerification({ handleVerifyOTP, processingVerify }: Props) {
  const { t } = useTranslation();

  async function verifyOTP(otp: string) {
    handleVerifyOTP(Number(otp));
  }

  async function resendOTP() {
    const accessToken = localStorage.getItem(KEY.ACCESS_TOKEN);
    if (!accessToken) return;
    const [resOTP, errorOTP] = await authServices.requestResendOtp({
      type: ETypeRequestSendOTP.confirm_withdraw,
      normalToken: accessToken,
    });
    if (errorOTP) {
      toast.error(t("login.toastResendOTPError"));
    } else {
      toast.success(t("login.toastResendOTPSuccess"));
    }
  }

  return (
    <VerifyOTP
      titleBtn={t("forgotPassword.btnContinue")}
      countdown={120}
      loadingBtn={processingVerify}
      errorOTP={false}
      onClick={verifyOTP}
      onResendOTP={resendOTP}
      className={styles["verification-otp"]}
    />
  );
}

export default OTPVerification;

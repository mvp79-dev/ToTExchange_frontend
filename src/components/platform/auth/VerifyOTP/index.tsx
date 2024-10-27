import { Button } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { replaceEmails } from "../../../../app/common/helper";
import Countdown from "../../../common/Countdown";
import InputOTP from "../../../common/Inputs/InputOTP";
import style from "./style.module.scss";
import { useTranslation } from "react-i18next";

type Props = {
  titleBtn: string;
  onClick: (otp: string) => void;
  errorOTP: boolean;
  countdown: number;
  onResendOTP: () => void;
  email?: string;
  title?: string;
  loadingBtn: boolean;
  className?: string;
};

export default function VerifyOTP({
  titleBtn,
  onClick,
  errorOTP,
  countdown,
  onResendOTP,
  email,
  loadingBtn,
  title = "Xác thực OTP",
  className = "",
}: Props) {
  const [otp, setOtp] = useState<string>("");
  const [resendCode, setResendCode] = useState<boolean>(false);
  const [counter, setCounter] = useState<any>(-1);
  const { t } = useTranslation();

  useEffect(() => {
    setCounter(countdown);
  }, [countdown]);

  const handleClick = () => {
    onClick(otp);
  };

  const handleResendOTP = async () => {
    onResendOTP();
  };

  return (
    <div className={classNames(style.container, className)}>
      <div className={style.content}>
        <span className={style.title}>{title}</span>
        <div className={style.textPhone}>
          {t("verifyOTP.content")}{" "}
          <span className={style.highlightText}>
            {email && replaceEmails(email)}
          </span>
        </div>
        <div className={style.otp}>
          <InputOTP
            className={classNames(style.inputOTP, errorOTP && style.errorOTP)}
            value={otp}
            numInputs={6}
            onChange={setOtp}
          />
          {errorOTP && (
            <span className={style.errorOTP}>{t("verifyOTP.errorOTP")}</span>
          )}
        </div>
        <div className={style.resendCode}>
          <div>
            {t("verifyOTP.textResendOTP")}{" "}
            <Countdown
              counter={counter}
              onEndCountdown={(value) => setResendCode(value)}
            />
          </div>
          <button
            onClick={handleResendOTP}
            disabled={!resendCode}
            className={style.btnResendCode}
          >
            {t("verifyOTP.btnResendOTP")}
          </button>
        </div>
        <div className={style.btnConfirm}>
          <Button
            disabled={!otp || loadingBtn}
            className="ant-btn-custom"
            onClick={handleClick}
            loading={loadingBtn}
          >
            {titleBtn}
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import OTPInput from "react-otp-input";

type Props = {
  renderSeparator?: React.ReactNode;
  numInputs: number;
  value: string;
  onChange: (otp: string) => void;
  className?: string;
};

export default function InputOTP({
  renderSeparator,
  numInputs,
  value,
  onChange,
  className,
}: Props) {
  return (
    <div className={className}>
      <OTPInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        renderSeparator={renderSeparator}
        renderInput={(props) => <input {...props} />}
      />
    </div>
  );
}

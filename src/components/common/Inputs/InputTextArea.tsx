import { Input } from "antd";
import React from "react";
import { IDataInput } from "./InputNormal";

type Props = {
  placeholder?: string;
  value: string;
  name: string;
  disabled?: boolean;
  onChange: (data: IDataInput) => void;
  error?: boolean;
  errorText?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
};

export default function InputTextArea({
  error,
  placeholder,
  name,
  disabled,
  errorText,
  onChange,
  maxLength,
  rows = 3,
  value,
  className,
}: Props) {
  const onFormFieldChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    onChange({
      name,
      value: String(event.target.value),
    });
  };

  return (
    <Input.TextArea
      placeholder={placeholder}
      disabled={disabled}
      onChange={onFormFieldChange}
      maxLength={maxLength}
      rows={rows}
      value={value}
      className={className}
    />
  );
}

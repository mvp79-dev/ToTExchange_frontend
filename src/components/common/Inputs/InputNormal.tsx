import { Input } from "antd";

export interface IDataInput {
  name: string;
  value: string | undefined;
}

type Props = {
  title?: string | React.ReactNode;
  placeholder?: string;
  value: string | number | null | undefined;
  type?: "number" | "string" | "phone";
  name: string;
  disabled?: boolean;
  onChange: (data: IDataInput) => void;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  bordered?: boolean;
  className?: string;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  errorText?: string;
  onBlur?: () => void;
};

export default function InputNormal({
  value,
  type,
  name,
  disabled,
  onChange,
  suffix,
  prefix,
  error,
  onKeyDown,
  bordered,
  placeholder,
  style,
  min,
  max,
  errorText,
  onBlur,
  className,
}: Props) {
  const displayedValue =
    type === "number"
      ? value?.toString()
        ? value.toString()
        : ""
      : value
      ? String(value)
      : "";

  const onFormFieldChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const value = String(event.target.value);
    const newValue =
      type === "phone"
        ? String(/^[0-9]+$/.test(value) ? value : value.replace(/[^0-9]/g, ""))
        : type === "number"
        ? String(/^[0-9]+$/.test(value) ? value : value.replace(/[^0-9.]/g, ""))
        : value;
    onChange({
      name,
      value: newValue,
    });
  };

  return (
    <Input
      placeholder={placeholder}
      value={displayedValue}
      disabled={disabled}
      type="string"
      onChange={onFormFieldChange}
      suffix={suffix}
      prefix={prefix}
      bordered={bordered}
      onKeyDown={(e) => {
        if (onKeyDown) {
          onKeyDown(e);
        }
      }}
      onBlur={onBlur}
      style={style}
      maxLength={max}
      minLength={min}
      status={error ? "error" : undefined}
      className={className}
    />
  );
}

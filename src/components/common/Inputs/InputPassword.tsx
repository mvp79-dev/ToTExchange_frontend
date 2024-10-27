import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import { IDataInput } from "./InputNormal";

type Props = {
  placeholder?: string;
  value: string | ReadonlyArray<string> | number | undefined;
  name: string;
  disabled?: boolean;
  onChange: (data: IDataInput) => void;
  error?: boolean;
  min?: number;
  max?: number;
  errorText?: string;
  className?: string;
  prefix?: React.ReactNode;
};

export default function InputPassword({
  placeholder,
  disabled,
  name,
  value,
  max,
  min,
  error,
  onChange,
  errorText,
  className,
  prefix,
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
    <Input.Password
      name={name}
      value={value}
      iconRender={(visible) =>
        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
      }
      placeholder={placeholder}
      disabled={disabled}
      maxLength={max}
      minLength={min}
      status={error ? "error" : undefined}
      onChange={onFormFieldChange}
      className={className}
      prefix={prefix}
    />
  );
}

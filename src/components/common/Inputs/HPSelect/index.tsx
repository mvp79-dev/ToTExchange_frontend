import IconSuffixSelect from "@/assets/icons/suffixInputSelect.svg";
import { Select } from "antd";
import { ReactNode } from "react";
import style from "./style.module.scss";

export interface IOpionsHPSelect {
  label: string | number | React.ReactNode;
  value: string | number;
}

type Props = {
  options: IOpionsHPSelect[];
  onChange?: (value: string) => void;
  placeholder?: string;
  mode?: "multiple" | "tags";
  tokenSeparators?: string[];
  defaultValue?: string;
  value?: string;
  suffixIcon?: ReactNode;
};

export default function HPSelect({
  options,
  onChange,
  placeholder,
  mode,
  tokenSeparators,
  defaultValue,
  value,
  suffixIcon = <img src={IconSuffixSelect} alt="" />,
}: Props) {
  return (
    <Select
      onChange={onChange}
      suffixIcon={suffixIcon}
      options={options}
      placeholder={placeholder}
      mode={mode}
      tokenSeparators={tokenSeparators}
      defaultValue={defaultValue}
      value={value}
      className={style.hpSelect}
    />
  );
}

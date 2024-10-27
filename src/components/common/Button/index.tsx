import { Button, ButtonProps } from "antd";
import React from "react";

type Props = {
  type?: ButtonProps["type"];
  title: string;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  htmlType?: "button" | "submit" | "reset" | undefined;
  icon?: React.ReactNode;
  disabled?: boolean;
  isImport?: boolean;
  multiple?: boolean;
  accept?: any;
  onSelectFile?: (e: any) => void;
  className?: string;
  wrapperClassName?: string;
};

export default function HPButton({
  title,
  loading,
  onClick,
  style,
  htmlType,
  type,
  icon,
  disabled,
  isImport = false,
  multiple = false,
  accept,
  onSelectFile,
  className,
  wrapperClassName,
}: Props) {
  const inputEl = React.useRef<any>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isImport) {
      inputEl.current.click();
    } else {
      onClick && onClick(e);
    }
  };

  const handleChange = (e: any) => {
    const files = e.target.files;
    onSelectFile && onSelectFile(files);
    e.target.value = "";
  };

  return (
    <div className={wrapperClassName}>
      <Button
        disabled={disabled}
        type={type}
        icon={icon}
        loading={loading}
        size="large"
        onClick={handleClick}
        style={style}
        htmlType={htmlType}
        className={className}
      >
        <div>{title}</div>
      </Button>
      {isImport && (
        <input
          ref={inputEl}
          type="file"
          multiple={multiple}
          hidden
          accept={accept}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

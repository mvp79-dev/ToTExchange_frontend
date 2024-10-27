import { Tooltip } from "antd";
import React from "react";
import style from "./style.module.scss";

type Props = {
  title: string | React.ReactNode;
  arrow?: boolean;
  icon?: React.ReactNode;
  maxWidth?: number;
  background?: string;
  color?: string;
  width?: number | string;
};

const HPTooltip: React.FC<Props> = ({
  title,
  arrow,
  icon,
  maxWidth = 252,
  background = "#ffffff",
  color = "#333333",
  width = "100%",
}) => {
  return (
    <Tooltip
      color={color}
      overlayStyle={{ width: width, maxWidth }}
      title={title && <label className={style.hpTooltip}>{title}</label>}
      arrow={arrow || true}
    >
      {icon}
    </Tooltip>
  );
};

export default HPTooltip;

import { Progress } from "antd";
import React from "react";
import style from "./style.module.scss";

type Props = {
  percent?: number;
  format?: (percent?: number, successPercent?: number) => React.ReactNode;
  strokeColor?: string;
  styleCss?: React.CSSProperties;
  strokeWidth?: number;
};

export default function HPProgress({
  percent,
  format = () => "",
  strokeColor = "#9DCA00",
  styleCss,
  strokeWidth = 8,
}: Props) {
  return (
    <Progress
      type="circle"
      percent={percent}
      format={format}
      className={style.hpProgress}
      style={styleCss}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
    />
  );
}

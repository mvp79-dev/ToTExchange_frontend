import { StepProps, Steps } from "antd";
import classNames from "classnames";
import style from "./style.module.scss";

type Props = {
  activeStep: number;
  dataStep: StepProps[];
  className?: string;
  labelPlacement?: "horizontal" | "vertical";
};

export default function HPSteps({
  activeStep,
  dataStep,
  className,
  labelPlacement,
}: Props) {
  return (
    <Steps
      size="small"
      current={activeStep}
      items={dataStep}
      labelPlacement={labelPlacement}
      className={classNames(className, style.hpSteps)}
    />
  );
}

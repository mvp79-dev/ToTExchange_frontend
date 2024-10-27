import { StepProps, Steps } from "antd";
import style from "./style.module.scss";
type Props = {
  data?: StepProps[];
  activeTimeline?: number;
  className?: string;
};

export default function TimeLineOrder({
  data,
  activeTimeline,
  className,
}: Props) {
  return (
    <div className={style.timelineOrder}>
      <Steps
        items={data}
        current={Number(activeTimeline)}
        labelPlacement="vertical"
        className={className}
      />
    </div>
  );
}

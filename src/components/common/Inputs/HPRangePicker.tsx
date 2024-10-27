import { DatePicker } from "antd";
import { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
type Props = {
  showTime?: boolean;
  defaultValue?: any;
  disabled?: boolean;
  onRangeChange: (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => void;
};

export default function HPRangePicker({
  showTime = false,
  defaultValue,
  disabled,
  onRangeChange,
}: Props) {
  return (
    <RangePicker
      showTime={showTime}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onRangeChange}
    />
  );
}

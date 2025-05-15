import { RangePickerProps } from "antd/es/date-picker";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const CustomRangePicker = (props: RangePickerProps) => {
  return <RangePicker
    {...props}
  />
}

export default CustomRangePicker;
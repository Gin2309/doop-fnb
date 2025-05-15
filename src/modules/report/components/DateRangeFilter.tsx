import { Form, FormInstance } from "antd";
import { PropsWithoutRef } from "react";
import { RevenueFormData, useReportDateRangeFilter } from "./useReportDateRangeFilter";
import dayjs from "dayjs";
import CustomRangePicker from "@/components/CustomRangePicker";
import { CustomSelect } from "@/components/CustomSelect";

const DateRangeFilter = (props: PropsWithoutRef<{
  form: FormInstance<RevenueFormData>;
}>) => {
  const {
    form,
  } = props;

  const { now, showHourSelect } = useReportDateRangeFilter(form, "");

  return <Form
    form={form}
    initialValues={{
      range: [dayjs(now).startOf("day").valueOf(), dayjs(now).endOf("day").valueOf()],
      hourIndex: null
    }}
  >
    <div className="flex flex-col xl:flex-row justify-between gap-4">
      <div className="flex gap-4 flex-wrap">
        <div className="w-full sm:w-auto 2xl:w-[320px]">
          <Form.Item
            className="!mb-0"
            getValueFromEvent={(value: [dayjs.Dayjs, dayjs.Dayjs]) => {
              const [start, end] = value || [];
              if (!start || !end) return [];
              return [
                dayjs(start).startOf("day").valueOf(),
                dayjs(end).endOf("day").valueOf(),
              ];
            }}
            getValueProps={(value: [number, number]) => {
              const [start, end] = value;
              if (!start || !end) return { value: [] }
              return {
                value: [
                  dayjs(start).startOf("day"),
                  dayjs(end).endOf("day"),
                ]
              }
            }}
            name="range"
          >
            <CustomRangePicker
              format="DD/MM/YYYY"
              placeholder={["--Từ ngày--", "--Đến ngày--"]}
              size="large"
              className="w-full h-[44px]"
            />
          </Form.Item>
        </div>

        {showHourSelect && <div className="w-full sm:w-auto 2xl:w-[220px]">
          <Form.Item
            className="!mb-0"
            name="hourIndex"
          >
            <CustomSelect
              options={new Array(24).fill(null).map((_, index) => ({
                value: index,
                label: `${index < 10 ? "0" : ""}${index}:00 - ${index < 10 ? "0" : ""}${index + 1}:00`
              }))}
              allowClear
              placeholder="--Giờ--"
            />
          </Form.Item>
        </div>}
      </div>
    </div>
  </Form>
}

export default DateRangeFilter;
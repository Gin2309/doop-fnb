import { DatePicker } from "antd";
import cx from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { ReactNode } from "react";

import DateIcon from "@/assets/CalendarBlank.svg";
import TimeIcon from "@/assets/Clock.svg";

export function CustomDatePicker({
  className,
  suffixIcon,
  placeholder,
  onChange,
  format,
  showTime,
  value,
  bordered = true,
  picker = "date",
}: {
  className?: string;
  suffixIcon?: ReactNode;
  placeholder?: string;
  onChange?: (value) => void;
  format?: string;
  value?: string | null | any;
  bordered?: boolean;
  showTime?: any;
  picker?: "date" | "time" | "datetime";
}) {
  const isTimePicker = picker === "time";
  const isDateTimePicker = picker === "datetime";

  const handleChange = (date) => {
    if (date) {
      const formattedValue = isTimePicker
        ? date.format("HH:mm")
        : isDateTimePicker
        ? date.format("YYYY-MM-DD HH:mm")
        : date.format("YYYY-MM-DD");
      onChange?.(formattedValue);
    } else {
      onChange?.(null);
    }
  };

  const dateValue = value ? dayjs(value) : null;

  return (
    <DatePicker
      onChange={handleChange}
      className={cx(
        className,
        "h-11 w-full focus:shadow-none focus-within:shadow-none",
        {
          "border-b border-t-0 border-l-0 border-r-0 border-[#FBECEE] rounded-none":
            !bordered,
        }
      )}
      suffixIcon={
        suffixIcon || (
          <Image
            src={isTimePicker ? TimeIcon : DateIcon}
            alt=""
            className="cursor-pointer"
          />
        )
      }
      placeholder={placeholder || (isTimePicker ? "HH:mm" : "dd/mm/yyyy")}
      format={
        isDateTimePicker
          ? "YYYY-MM-DD HH:mm"
          : isTimePicker
          ? "HH:mm"
          : "YYYY-MM-DD"
      }
      value={dateValue}
      picker={picker === "datetime" ? "date" : picker}
      showTime={isDateTimePicker ? { format: "HH:mm" } : showTime}
    />
  );
}

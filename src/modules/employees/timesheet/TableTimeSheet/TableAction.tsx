import { CustomInput } from "@/components/CustomInput";
import { DatePicker, Dropdown, MenuProps, Space } from "antd";
import Image from "next/image";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { useTranslation } from "react-i18next";

import UserPlus from "@/assets/UserPlus.svg";
import Calendar from "@/assets/Calendar.svg";
import Check from "@/assets/Check.svg";
import DownloadSimple from "@/assets/DownloadSimple.svg";
import ArrowUpLeft from "@/assets/ArrowUpLeft.svg";
import { useState } from "react";
import dayjs from "dayjs";
import DetailTimeSheet from "./components/DetailTimeSheet";

export default function TableAction({ selectedDate, setSelectedDate }) {
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span>Mặt hàng 1</span>,
    },
    {
      key: "2",
      label: <span>Mạt hàng 2</span>,
    },
    {
      key: "3",
      label: <span>Mặt hàng 3</span>,
    },
  ];

  const handleClick = () => {
    const datePicker = document.getElementById(
      "datePicker"
    ) as HTMLInputElement | null;
    if (datePicker) {
      datePicker.click();
    }
  };

  const handleDateChange = (date) => {
    // `date` sẽ là giá trị mới được chọn từ DatePicker
    setSelectedDate(date);
    console.log("Selected date:", date.format("YYYY-MM"));
  };

  return (
    <div>
      <Space.Compact className="w-full">
        <div className="w-1/6 border-[1px] px-[10px] flex items-center rounded-l-lg border-[#E5E5E5] border-r-0">
          <Dropdown menu={{ items }}>
            <Space>
              <div className="flex items-center">
                <Image src={FilterIcon} />
                <span className=" mx-2 cursor-pointer">
                  {t("branchFilter")}
                </span>
                <Image src={DropIcon} />
              </div>
            </Space>
          </Dropdown>
        </div>
        <CustomInput
          placeholder="Tìm kiếm "
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className="h-[44px]"
          wrapClassName="w-full"
          onChange={() => {}}
        />
      </Space.Compact>

      <div className="mt-5">
        <div className="flex justify-between items-center p-3 bg-[#F9FAFD]">
          <div>
            <p className="text-[#FF5C00] text-lg font-semibold">
              Bảng chấm công từ{" "}
              {selectedDate.startOf("month").format("DD/MM/YYYY")} đến{" "}
              {selectedDate.endOf("month").format("DD/MM/YYYY")}
            </p>
            <p className="text-[#66666] ">Tiến trình tính công: 100%</p>
          </div>

          <div className="flex gap-3">
            <div
              className="relative text-center p-3 cursor-pointer"
              onClick={handleClick}
            >
              <Image src={Calendar} />
              <p className="text-[#666666]">{t("month")}</p>
              <DatePicker
                id="datePicker"
                picker="month"
                className="absolute bottom-[10%] left-0 opacity-0"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="text-center p-3 cursor-pointer">
              <Image src={Check} />
              <p className="text-[#666666]">{t("confirm")}</p>
            </div>
            <div className="text-center p-3 cursor-pointer">
              <Image src={ArrowUpLeft} />
              <p className="text-[#666666]">{t("reconfirm")}</p>
            </div>
            <div className="text-center p-3 cursor-pointer">
              <Image src={DownloadSimple} />
              <p className="text-[#666666]">{t("exportFile")}</p>
            </div>
            <div className="text-center p-3 cursor-pointer">
              <Image src={UserPlus} />
              <p className="text-[#666666]">{t("addPerson")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

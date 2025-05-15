import { CustomInput } from "@/components/CustomInput";
import { DatePicker, Dropdown, Menu, MenuProps, Space } from "antd";
import Image from "next/image";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import { useState } from "react";

export default function TableAction({ formFilter, setFormFilter }) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between">
      <Space.Compact className="flex items-center w-1/3">
        <CustomInput
          placeholder="Tìm kiếm..."
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className="h-[44px]"
          wrapClassName="w-full"
          onChange={(e) => {
            setFormFilter({ ...formFilter, keyword: e });
          }}
        />
      </Space.Compact>

      <div className="flex items-center mb-1 py-2 gap-3 ">
        <CustomButton
          type="export"
          className="!rounded-md"
          prefixIcon={<Image src={Download} />}
        >
          {t("download")}
        </CustomButton>
        <CustomButton
          type="print-btn"
          className="!rounded-md"
          prefixIcon={<Image src={Printer} />}
        >
          {t("In danh sách")}
        </CustomButton>
      </div>
    </div>
  );
}

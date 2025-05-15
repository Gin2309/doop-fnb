import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import Excel from "@/assets/images/excel.png";

const Header = () => {
  const { t } = useTranslation();

  const reportGroup = {
    data: {
      items: [
        { id: "1", name: "Doanh thu tổng quan" },
        { id: "2", name: "Doanh thu theo quý" },
        { id: "3", name: "Doanh thu theo tháng" },
      ],
    },
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-4 flex-wrap ">
          <div className="w-full sm:w-auto lg:w-[220px]">
            <CustomSelect
              options={reportGroup?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              showSearch={true}
              onChange={(value) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="--Chọn thời gian--"
            />
          </div>

          <CustomButton className="view">{t("viewReport")}</CustomButton>
          <div className="flex sm:hidden">
            <CustomButton className="export" prefixIcon={<Image src={Excel} />}>
              {t("exportReport")}
            </CustomButton>
          </div>
        </div>
        <div className="hidden sm:flex">
          <CustomButton className="export" prefixIcon={<Image src={Excel} />}>
            {t("exportReport")}
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default Header;

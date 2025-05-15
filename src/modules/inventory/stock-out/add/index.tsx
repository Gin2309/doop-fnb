import React from "react";
import { useTranslation } from "react-i18next";

import { Space } from "antd";

import { CustomButton } from "@/components/CustomButton";
import AddReceipt from "../../AddReciept/add";

const AddExportReceipt = () => {
  const { t } = useTranslation();

  const dataSource = [
    {
      name: "Monster",
      unit: "2",
      quantity: 1000,
    },
  ];

  return (
    <>
      <AddReceipt dataSource={dataSource} title="addExportReceipt" />

      <div className="card flex justify-end 2xs:my-4 md:my-6">
        <Space>
          <CustomButton
            type="original"
            wrapClassName="2xs:w-[75px] sm:w-[85px] md:w-[100px]"
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            type="border-color"
            wrapClassName="2xs:w-[75px] sm:w-[85px] md:w-[100px]"
          >
            {t("order")}
          </CustomButton>
          <CustomButton
            type="primary"
            wrapClassName="2xs:w-[170px] md:w-[187px]"
          >
            {t("orderAndStockOut")}
          </CustomButton>
        </Space>
      </div>
    </>
  );
};

export default AddExportReceipt;

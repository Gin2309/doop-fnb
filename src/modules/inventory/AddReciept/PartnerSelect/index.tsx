import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Select } from "antd";
import Image from "next/image";
import { WrapperStyled } from "./styled";

import PlusIcon from "@/assets/plusOrangeIcon.svg";
import SortingIcon from "@/assets/column-sorting.svg";
import { CustomButton } from "@/components/CustomButton";
const { Option } = Select;

const PartnerSelect = ({ partners, onClick }) => {
  const { t } = useTranslation();

  return (
    <WrapperStyled>
      <Select
        showSearch
        placeholder={t("selectPartner")}
        className="suffix-icon h-11 !rounded"
        suffixIcon={
          <div className="flex items-center">
            <Image src={SortingIcon} alt="" />
          </div>
        }
        dropdownRender={(menu) => (
          <>
            <div className="flex flex-start">
              <CustomButton
                type="outline"
                className="!rounded-[50px]"
                prefixIcon={<Image src={PlusIcon} />}
                onClick={onClick}
              >
                {t("addPartner")}
              </CustomButton>
            </div>

            {menu}
          </>
        )}
        onChange={(value) => console.log(value)}
      >
        {partners?.data?.items?.map((partner: any) => (
          <Option key={partner.id} value={partner.id}>
            {partner.name}
          </Option>
        ))}
      </Select>
    </WrapperStyled>
  );
};

export default PartnerSelect;

import React from "react";
import Image from "next/image";
import { StyledHeaderWrapper } from "./styled";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";

import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import searchIcon from "@/assets/searchIcon.svg";

const Header = ({ setFormFilter }) => {
  const { t } = useTranslation();

  const handleInputChange = (value) => {
    setFormFilter((prevFilter) => ({
      ...prevFilter,
      keyword: value,
    }));
  };

  return (
    <>
      <StyledHeaderWrapper>
        <div className="flex sm:justify-between 2xs:justify-normal 2xs:flex-col sm:flex-row gap-3">
          <div>
            <CustomInput
              placeholder={t("searchCombo")}
              onChange={handleInputChange}
              className="h-[40px] lg:w-[426px] sm:w-auto"
              prefixIcon={<Image src={searchIcon} />}
            />
          </div>

          <div className="flex gap-3">
            <CustomButton
              type="download-btn"
              prefixIcon={<Image src={Download} />}
            >
              {t("download")}
            </CustomButton>
            <CustomButton type="print-btn" prefixIcon={<Image src={Printer} />}>
              {t("printList")}
            </CustomButton>
          </div>
        </div>
      </StyledHeaderWrapper>
    </>
  );
};

export default Header;

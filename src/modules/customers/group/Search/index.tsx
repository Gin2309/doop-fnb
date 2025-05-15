import { useTranslation } from "react-i18next";
import Image from "next/image";

import { ComponentStyled } from "./styled";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";

import MagnifyingGlass from "@/assets/MagnifyingGlass.svg";

import React from "react";

const Search = ({
  setFormFilter,
  onClick,
}: {
  setFormFilter: any;
  onClick?: any;
}) => {
  const { t } = useTranslation();

  const handleInputChange = (value) => {
    setFormFilter((prevFilter) => ({
      ...prevFilter,
      keyword: value,
    }));
  };

  return (
    <>
      <ComponentStyled>
        <div className="grid grid-cols-12">
          <div className="md:col-span-10 2xs:col-span-7 xs:col-span-8 sm:col-span-9">
            <CustomInput
              onChange={handleInputChange}
              className="suffix-icon h-11 !rounded "
              placeholder={t("searchCustomer")}
            />
          </div>
          <div
            onClick={onClick}
            className="md:col-span-2 2xs:col-span-5 xs:col-span-4 sm:col-span-3"
          >
            <CustomButton
              type="search"
              prefixIcon={<Image src={MagnifyingGlass} />}
            >
              {t("search")}
            </CustomButton>
          </div>
        </div>
      </ComponentStyled>
    </>
  );
};

export default Search;

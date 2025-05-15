import React from "react";
import Image from "next/image";
import searchIcon from "@/assets/searchIcon.svg";
import { useTranslation } from "react-i18next";
import { ComponentStyled, SearchInput } from "./styled";

const Search = ({ title }) => {
  const { t } = useTranslation();

  return (
    <>
      <ComponentStyled>
        <SearchInput
          placeholder={t(title)}
          prefix={<Image src={searchIcon} alt="search icon" />}
        />
      </ComponentStyled>
    </>
  );
};

export default Search;

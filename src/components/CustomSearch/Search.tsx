import React from "react";
import { Dropdown, MenuProps } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import searchIcon from "@/assets/searchIcon.svg";
import filterIcon from "@/assets/filter.svg";
import ArrowIcon from "@/assets/arrowIcon.svg";
import { ComponentStyled, FilterInput, SearchInput } from "./styled";

interface SearchProps {
  title?: string;
  items: MenuProps["items"];
}

const Search: React.FC<SearchProps> = ({ title = "filter", items }) => {
  const { t } = useTranslation();

  return (
    <ComponentStyled className="xs:max-w-[320px] md:max-w-[426px] ">
      <Dropdown menu={{ items }} placement="bottomLeft">
        <FilterInput
          placeholder={t(title)}
          prefix={<Image src={filterIcon} alt="filter icon" />}
          suffix={<Image src={ArrowIcon} alt="arrow icon" />}
        />
      </Dropdown>
      <SearchInput
        placeholder={t("search")}
        prefix={<Image src={searchIcon} alt="search icon" />}
      />
    </ComponentStyled>
  );
};

export default Search;

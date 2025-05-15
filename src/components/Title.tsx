import React from "react";
import { useTranslation } from "react-i18next";

interface TitleProps {
  children: string;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="my-4">
      <h1 className="2xs:text-[20px] sm:text-[24px] md:text-3xl font-semibold  text-line-1 text-[#1A1A1A]">
        {t(children)}
      </h1>
    </div>
  );
};

export default Title;

import React from "react";
import { useTranslation } from "react-i18next";
import { CustomTagWrapper } from "./styled";

type CustomTagProps = {
  color: string;
  title: string;
};

const CustomTag: React.FC<CustomTagProps> = ({ color, title }) => {
  const { t } = useTranslation();

  return (
    // success | processing | warning | error | volcano | default | purple | geekblue
    <CustomTagWrapper color={color} bordered={false}>
      {t(title)}
    </CustomTagWrapper>
  );
};

export default CustomTag;

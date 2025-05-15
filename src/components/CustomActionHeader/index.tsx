import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Space } from "antd";
import { CustomButton } from "../CustomButton";

interface CustomActionHeaderProps {
  title: string;
  btnTitle?: string;
  type: "save" | "delete" | "title" | "custom";
  isLoading?: boolean;
  onSubmit?: () => void;
  onDelete?: () => void;
  CustomBtn?: any;
}

const CustomActionHeader = ({
  title,
  btnTitle = "save",
  type,
  isLoading,
  onSubmit,
  onDelete,
  CustomBtn,
}: CustomActionHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const renderButtons = () => {
    switch (type) {
      case "title":
        return null;
      case "delete":
        return (
          <>
            <CustomButton
              type="original"
              wrapClassName="2xs:w-[80px] sm:w-[100px]"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </CustomButton>
            <CustomButton
              type="danger"
              wrapClassName="2xs:w-[80px] sm:w-[100px]"
              className="!bg-white text-red-500 border-red-500"
              onClick={onDelete}
            >
              {t("delete")}
            </CustomButton>
            <CustomButton
              type="primary"
              isLoading={isLoading}
              wrapClassName="2xs:w-[80px] sm:w-[100px]"
              onClick={onSubmit}
            >
              {t(btnTitle)}
            </CustomButton>
          </>
        );
      case "custom":
        return <CustomBtn />;
      case "save":
      default:
        return (
          <>
            <CustomButton
              type="original"
              wrapClassName="2xs:w-[80px] sm:w-[100px]"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </CustomButton>
            <CustomButton
              type="primary"
              disabled={isLoading}
              wrapClassName="2xs:w-[80px] sm:w-[100px]"
              onClick={onSubmit}
            >
              {t(btnTitle)}
            </CustomButton>
          </>
        );
    }
  };

  return (
    <div className="flex justify-between bg-white px-4 shadow-md mb-5 mx-[-32px] h-[80px] items-center">
      <p className="text-2xl font-semibold">{t(title)}</p>
      <Space>{renderButtons()}</Space>
    </div>
  );
};

export default CustomActionHeader;

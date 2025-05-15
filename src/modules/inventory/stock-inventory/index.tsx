import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Image from "next/image";
import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import Tab from "@/components/CustomTab";
import Ingredients from "./Tab1";
import Products from "./Tab2";
import AddModal from "./AddModal";

import ExportIcon from "@/assets/export.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import ImportIcon from "@/assets/Import.svg";

const Stock = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 550);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tabs = [t("ingredient"), t("products")];

  const components = [
    <Ingredients key="ingredient" />,
    <Products key="products" />,
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>ingredientItemList</Title>
        <div>
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => setOpen(true)}
            className={`${isSmallScreen ? "no-text" : ""}`}
          >
            {t("createIngredient")}
          </CustomButton>
        </div>
      </div>

      <div className="flex items-center mb-4 py-2 ">
        <CustomButton
          type="export"
          className="!rounded-[50px]"
          prefixIcon={<Image src={ExportIcon} />}
        >
          {t("exportList")}
        </CustomButton>
        <div className="w-[12px] border-[1px] rotate-[-90deg] mx-[5px] border-[#B2B2B2]"></div>
        <CustomButton
          type="export"
          className="!rounded-[50px]"
          prefixIcon={<Image src={ImportIcon} />}
        >
          {t("importList")}
        </CustomButton>
      </div>

      <Tab menu={tabs} components={components} defaultIndex={0} />

      <AddModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
};

export default Stock;

import React from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { formatTime } from "@/utils";
import Header from "./Header";
import CustomTab from "./CustomTab";

import { useRecoilValue } from "recoil";
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import { branchStateSession } from "@/recoil/state";

const Inventory = () => {
  const { t } = useTranslation();
  const now = dayjs();
  const branch = useRecoilValue(branchStateSession);
  const branchName = branch?.name;

  const tabs = [t("ingredient"), t("stock")];

  const components = [<Tab1 key="ingredient" />, <Tab2 key="stock" />];

  return (
    <>
      <div className="my-6">
        <h1 className="text-center text-[28px] md:text-[36px] text-[#1A1A1A] font-semibold">
          {t("warehouseReport")}
        </h1>
        <h2 className="text-center text-[#333333]">
          <span>{t("viewReportAt")}</span>: {formatTime(now)}
        </h2>
        <h2 className="text-center text-[#333333]">
          <span>{t("branch")}</span>: {branchName}
        </h2>
      </div>

      <div className="card">
        <Header />

        <CustomTab menu={tabs} components={components} defaultIndex={0} />
      </div>
    </>
  );
};

export default Inventory;

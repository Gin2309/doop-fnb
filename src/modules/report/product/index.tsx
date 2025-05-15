import { useTranslation } from "react-i18next";

import { formatTime } from "@/utils";
import Table from "./Table";

import { branchStateSession } from "@/recoil/state";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import DateRangeFilter from "../components/DateRangeFilter";
import { RevenueFormData, useReportDateRangeFilter } from "../components/useReportDateRangeFilter";
import { OverviewCategory } from "./overview-category/Table";
import ExportReportBtn from "../components/ExportReportBtn";

const Products = () => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const branchName = branch?.name;
  const [form] = Form.useForm<RevenueFormData>();

  const router = useRouter();
  const id = router.query.id;

  const safeId = typeof id === "string" ? id : "";

  const {
    now,
    formFilter,
    showHourSelect
  } = useReportDateRangeFilter(form, safeId);

  // const {
  //   currentDate,
  //   formFilter,
  //   comparisonFilter,
  //   comparisonType,
  //   setComparisonType,
  // } = useDateRange(safeId);

  return (
    <>
      <div className="my-6">
        <h1 className="text-center text-[28px] md:text-[36px] text-[#1A1A1A] font-semibold">
          {t("report_category")}
        </h1>
        <h2 className="text-center text-[#333333]">
          <span>{t("viewReportAt")}</span>: {formatTime(now)}
        </h2>
        <h2 className="text-center text-[#333333]">
          <span>{t("branch")}</span>: {branchName}
        </h2>
      </div>

      <div className="flex flex-col gap-6 mb-6">
        <div className="card flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <DateRangeFilter form={form} />

            <ExportReportBtn />
          </div>

          <div className="text-[#666666] uppercase text-xl font-medium">
            {t("report_category_title")}
          </div>

          <div>
            <OverviewCategory formFilter={formFilter.current} />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <Table />
      </div>
    </>
  );
};

export default Products;

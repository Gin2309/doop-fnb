import { branchStateSession } from "@/recoil/state";
import { Form, Skeleton } from "antd";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import DateRangeFilter from "../components/DateRangeFilter";
import ExportReportBtn from "../components/ExportReportBtn";
import TabsComponent from "../components/TabsComponent";
import { RevenueFormData, useReportDateRangeFilter } from "../components/useReportDateRangeFilter";
import ChartDiscount from "./components/ChartDiscount";
import useFilterRange from "./hooks/useFilterRange";
import TableVouchers from "./components/TableVouchers";

const DiscountRePort = () => {
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

  const { data, isLoading } = useFilterRange(formFilter.current);

  return (
    <>
      <div className="my-6">
        <h1 className="text-center text-[28px] md:text-[36px] text-[#1A1A1A] font-semibold">
          Báo cáo khuyến mại
        </h1>
        <h2 className="text-center text-[#333333]">
          <span>{t("viewReportAt")}</span>: {now.format("HH:mm DD/MM/YYYY")}
        </h2>
        <h2 className="text-center text-[#333333]">
          <span>{t("branch")}</span>: {branchName}
        </h2>
      </div>

      <div className="card">
        {/* <Header /> */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <DateRangeFilter form={form} />
          <ExportReportBtn />
        </div>
        <div className="divider mt-4 h-[6px] bg-[#F2F2F2]"></div>
        <div className="mt-4">
          <TabsComponent
            tabs={[
              {
                titleTab: "Tổng tiền khuyến mại",
                UITabs: isLoading
                  ? <Skeleton active className="h-full" />
                  : <ChartDiscount
                    data={data.map(item => ({
                      label: item.voucherName || "unknown",
                      value: item.value || 0
                    }))}
                  />
              },
              {
                titleTab: "Số lượng",
                UITabs: isLoading
                  ? <Skeleton active className="h-full" />
                  : <ChartDiscount
                    data={data.map(item => ({
                      label: item.voucherName || "unknown",
                      value: item.count || 0
                    }))}
                  />
              }
            ]}
          />
        </div>
        <div className="divider mt-4 h-[6px] bg-[#F2F2F2]"></div>
        <div className="mt-4">
          <TableVouchers
            data={data}
          />
        </div>
      </div>
    </>
  );
};

export default DiscountRePort;

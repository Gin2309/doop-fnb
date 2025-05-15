import { useTranslation } from "react-i18next";


import { branchStateSession } from "@/recoil/state";
import { Form } from "antd";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import DateRangeFilter from "../components/DateRangeFilter";
import ExportReportBtn from "../components/ExportReportBtn";
import { useReportDateRangeFilter } from "../components/useReportDateRangeFilter";
import ListOverBill from "./overview-bill/List";
import LineChart from "./overview-time/Table";


export type RevenueFormData = {
  range: [number, number];
  hourIndex: number;
}

const Revenue = () => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const branchName = branch?.name;

  const router = useRouter();
  const id = router.query.id;

  const safeId = typeof id === "string" ? id : "";
  const [form] = Form.useForm<RevenueFormData>();

  const {
    now,
    formFilter,
    showHourSelect
  } = useReportDateRangeFilter(form, safeId);

  const tableData = [
    {
      key: 1,
      day: "Thứ Hai",
      date: "2023-09-18",
      productAmount: 1000000,
      cancelAmount: 50000,
      refundAmount: 10000,
      discount: 20000,
      comboDiscount: 15000,
      tax: 100000,
      serviceFee: 50000,
      deliveryFee: 30000,
      deliveryPartnerAmount: 70000,
    },
    {
      key: 2,
      day: "Thứ Ba",
      date: "2023-09-19",
      productAmount: 1500000,
      cancelAmount: 60000,
      refundAmount: 12000,
      discount: 30000,
      comboDiscount: 18000,
      tax: 120000,
      serviceFee: 60000,
      deliveryFee: 40000,
      deliveryPartnerAmount: 80000,
    },
    {
      key: 3,
      day: "Thứ Tư",
      date: "2023-09-20",
      productAmount: 2000000,
      cancelAmount: 70000,
      refundAmount: 15000,
      discount: 25000,
      comboDiscount: 20000,
      tax: 150000,
      serviceFee: 75000,
      deliveryFee: 50000,
      deliveryPartnerAmount: 90000,
    },
    {
      key: 4,
      day: "Tổng cộng",
      date: "",
      productAmount: 4500000,
      cancelAmount: 180000,
      refundAmount: 37000,
      discount: 75000,
      comboDiscount: 53000,
      tax: 370000,
      serviceFee: 185000,
      deliveryFee: 120000,
      deliveryPartnerAmount: 240000,
    },
  ];

  return (
    <>
      <div className="my-6">
        <h1 className="text-center text-[28px] md:text-[36px] text-[#1A1A1A] font-semibold">
          {t("report_overviewRevenue")}
        </h1>
        <h2 className="text-center text-[#333333] mt-2">
          <span>{t("viewReportAt")}</span>: {now.format("HH:mm DD/MM/YYYY")}
        </h2>
        <h2 className="text-center text-[#333333] mt-2">
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
            {t("overviewRevenueReport")}
          </div>

          <ListOverBill {...formFilter} />

          <div>
            <LineChart formFilter={formFilter.current} />
          </div>
        </div>

        {/* <div className="card"> */}
        {/* <Table data={tableData} /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default Revenue;

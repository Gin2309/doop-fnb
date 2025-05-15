import { Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import ItemOverBill from "./Item";
import { getOverviewBill } from "@/api/overview.service";
import { calculateDifference, isValidFilter } from "@/helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { PropsWithoutRef } from "react";
import { isValidRevenueReportFilter, RevenueReportFormFilterData } from "../types";

export default function ListOverBill(props: PropsWithoutRef<{
  current: RevenueReportFormFilterData;
  prev: RevenueReportFormFilterData;
}>) {
  const {
    current,
    prev,
  } = props;
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`BILL_OVERVIEW`, current],
    () => getOverviewBill(current),
    {
      enabled: isValidRevenueReportFilter(current),
    }
  );

  const { data: prevData, isLoading: prevLoading } = useQuery(
    [`BILL_OVERVIEW_PREVIOUS`, prev],
    () => getOverviewBill(prev),
    {
      enabled: isValidRevenueReportFilter(prev)
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  const ListOverBill = [
    {
      key: "Tổng số hóa đơn",
      color: "#8569F6",
      value: data?.data.countBill ?? 0,
    },
    {
      key: "Số hoá đơn huỷ",
      color: "#FF736A",
      value: data?.data.totalReturn ?? 0,
    },
    {
      key: "Số lượng mặt hàng",
      color: "#FECF24",
      value: data?.data.totalProduct ?? 0,
    },
    {
      key: "Trung bình mặt hàng/ hóa đơn",
      color: "#22C55E",
      value: data?.data.avg ?? 0,
    },
    {
      key: "Doanh thu gồm thuế",
      color: "#5D83FF",
      value: data?.data.revenueAndTax ?? 0,
    },
  ];

  const moneyFields = [
    "Hoàn Hủy",
    "Tiền mặt hàng",
    "Trung bình doanh thu/ hóa đơn",
    "Doanh thu gồm thuế",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {ListOverBill.map(({ key, color, value }) => (
        <ItemOverBill
          key={key}
          color={color}
          title={t(key)}
          value={value}
          isMoney={moneyFields.includes(key)}
          difference={calculateDifference(value, prevData?.data?.[key])}
        />
      ))}
    </div>
  );
}

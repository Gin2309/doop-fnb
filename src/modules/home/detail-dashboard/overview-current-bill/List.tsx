import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Skeleton, Table } from "antd";
import { CustomCardItem } from "@/components/CustomCardItem";

import { useQuery } from "@tanstack/react-query";
import { getOverviewCurrentBill } from "@/api/overview.service";
import { calculateChange, isValidFilter } from "@/helpers/helpers";
import { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

interface DataType {
  groupBy: string;
  countCurrentBill: number;
  revenue: number;
}

export function ListOverviewCurrentBill({ formFilter }) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`CURRENT_BILL_OVERVIEW`, formFilter],
    () => getOverviewCurrentBill(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)), // Kiểm tra filter hợp lệ
    }
  );

  const { totalRevenue, totalCurrentBill } = useMemo(() => {
    if (data?.data) {
      return data.data.reduce(
        (acc, item) => {
          acc.totalRevenue += item.revenue;
          acc.totalCurrentBill += item.countCurrentBill;
          return acc;
        },
        { totalRevenue: 0, totalCurrentBill: 0 }
      );
    }
    return { totalRevenue: 0, totalCurrentBill: 0 };
  }, [data?.data]);

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold uppercase">{t("currentBill")}</p>
        <p className="text-lg text-[#FF5C00] cursor-pointer">{t("seeAll")}</p>
      </div>

      <div className="flex flex-col gap-1">
        {isLoading ? (
          Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex gap-5 justify-between items-center p-3"
                style={{ borderTop: index !== 0 ? "1px solid #ccc" : "" }}
              >
                <Skeleton.Avatar size={44} shape="circle" />
                <div className="flex flex-1 gap-5 justify-between">
                  <Skeleton active title={false} paragraph={{ rows: 1 }} />
                  <Skeleton active title={false} paragraph={{ rows: 1 }} />
                </div>
              </div>
            ))
        ) : (
          <>
            <div className="flex justify-between items-center font-semibold p-3 rounded-md">
              <p className="w-6/12">{t("serviceType")}</p>
              <p className="w-3/12 text-center">{t("orderCount")}</p>
              <p className="w-3/12 text-right">{t("orderCountTotal")}</p>
            </div>

            {data?.data?.map((item, index) => (
              <div
                key={item.groupBy}
                className="flex justify-between items-center p-3"
                style={{ borderTop: index !== 0 ? "1px solid #ccc" : "" }}
              >
                <p className="w-6/12 text-left">{item.groupBy}</p>
                <p className="w-3/12 text-center">{item.countCurrentBill}</p>
                <p className="w-3/12 text-right">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center p-3  rounded-md font-semibold">
              <p className="w-6/12">{t("totalRevenue")}</p>
              <p className="w-3/12 text-center">{totalCurrentBill}</p>
              <p className="w-3/12 text-right">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </>
        )}
      </div>
    </CustomCardItem>
  );
}

const formatCurrency = (value) => {
  if (value === 0) return "0đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

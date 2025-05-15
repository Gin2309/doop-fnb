import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { CustomCardItem } from "@/components/CustomCardItem";
import { formatCurrency } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { getOverviewByProduct } from "@/api/overview.service";
import { calculateChange, isValidFilter } from "@/helpers/helpers";

export function ListOverviewProduct({ title, formFilter, comparisonFilter }) {
  const router = useRouter();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`PRODUCT_OVERVIEW`, formFilter],
    () => getOverviewByProduct(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const { data: prevData, isLoading: prevLoading } = useQuery(
    [`PRODUCT_OVERVIEW_PREVIOUS`, comparisonFilter],
    () => getOverviewByProduct(comparisonFilter),
    {
      enabled: Boolean(isValidFilter(comparisonFilter)),
    }
  );

  const items =
    data?.data?.sort((a: any, b: any) => b.revenue - a.revenue) || [];

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold uppercase">{t(title)}</p>
        <p className="text-lg text-[#FF5C00] cursor-pointer">{t("seeAll")}</p>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading || prevLoading ? (
          <Skeleton active />
        ) : items.length > 0 ? (
          items.map((item: any, index: number) => {
            const prevRevenue =
              prevData?.data?.find(
                (prevItem: any) => prevItem.groupBy === item.groupBy
              )?.revenue || 0;
            const { percentage, color } = calculateChange(
              item.revenue,
              prevRevenue
            );

            return (
              <div
                className="flex gap-5 items-center p-3"
                key={item.groupBy}
                style={{ borderTop: index !== 0 ? "1px solid #cccc" : "" }}
              >
                <Image
                  width={74}
                  height={74}
                  src="https://gongcha.com.vn/wp-content/uploads/2018/02/Tr%C3%A0-s%E1%BB%AFa-Tr%C3%A2n-ch%C3%A2u-%C4%91en-1.png"
                  alt={item.groupBy}
                />
                <div className="flex flex-1 gap-5 justify-between">
                  <p className="text-base w-3/5 font-semibold">
                    {item.groupBy}
                  </p>
                  <div>
                    <p className="text-base font-semibold">
                      {formatCurrency(item.revenue)}{" "}
                      <span style={{ color }}>{percentage.toFixed(1)}%</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 mt-6">{t("noData")}</p>
        )}
      </div>
    </CustomCardItem>
  );
}

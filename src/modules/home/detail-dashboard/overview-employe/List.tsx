import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Skeleton } from "antd";
import { CustomCardItem } from "@/components/CustomCardItem";
import { formatCurrency } from "@/utils";
import Avatars from "@/assets/Avatar.svg";

import { useQuery } from "@tanstack/react-query";
import { getOverviewByEmployee } from "@/api/overview.service";
import { calculateChange, isValidFilter } from "@/helpers/helpers";

export function ListOverviewEmployee({ formFilter, comparisonFilter }) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`EMPLOYEE_OVERVIEW`, formFilter],
    () => getOverviewByEmployee(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const { data: data2 } = useQuery(
    [`EMPLOYEE_OVERVIEW`, comparisonFilter],
    () => getOverviewByEmployee(comparisonFilter),
    {
      enabled: Boolean(isValidFilter(comparisonFilter)),
    }
  );

  const employees = data?.data || [];
  const employeesComparison = data2?.data || [];

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold uppercase">
          {t("employeeTurnover")}
        </p>
        <p className="text-lg text-[#FF5C00] cursor-pointer">{t("seeAll")}</p>
      </div>

      <div className="flex flex-col gap-1">
        {isLoading ? (
          Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex gap-5 justify-center items-center p-3"
                style={{ borderTop: index !== 0 ? "1px solid #cccc" : "" }}
              >
                <Skeleton.Avatar size={44} shape="circle" />
                <div className="flex flex-1 gap-5 justify-between">
                  <Skeleton active title={false} paragraph={{ rows: 2 }} />
                </div>
              </div>
            ))
        ) : employees.length > 0 ? (
          employees.map((employee, index) => {
            const prevEmployee = employeesComparison.find(
              (e) => e.groupBy === employee.groupBy
            );
            const prevRevenue = prevEmployee ? prevEmployee.revenue : 0;
            const { percentage, color } = calculateChange(
              employee.revenue,
              prevRevenue
            );

            return (
              <div
                className="flex gap-5 justify-center items-center p-3"
                key={employee.userId}
                style={{ borderTop: index !== 0 ? "1px solid #cccc" : "" }}
              >
                <Image
                  width={44}
                  height={44}
                  src={Avatars}
                  alt={`Avatar for ${employee.groupBy}`}
                  className="rounded-full"
                />
                <div className="flex flex-1 gap-5 justify-between">
                  <div className="flex items-center">
                    <p className="text-xl w-3/5 font-semibold whitespace-nowrap">
                      {employee.groupBy}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-base font-semibold">
                      {formatCurrency(employee.revenue)}
                    </p>
                    <p className="font-semibold" style={{ color }}>
                      {percentage !== 0
                        ? `${percentage > 0 ? "+" : ""}${percentage.toFixed(
                            1
                          )}%`
                        : "0%"}
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

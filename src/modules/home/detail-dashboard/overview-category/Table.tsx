import { CustomCardItem } from "@/components/CustomCardItem";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Skeleton, Timeline } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getOverviewByCategory } from "@/api/overview.service";
import { isValidFilter } from "@/helpers/helpers";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

export function OverviewCategory({ formFilter }) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`CATEGORY_OVERVIEW`, formFilter],
    () => getOverviewByCategory(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const categoryData = data?.data || [];

  const chartData = {
    labels: categoryData.map((item) => item.groupBy),
    datasets: [
      {
        data: categoryData.map((item) => item.revenue),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw.toLocaleString("vi-VN");
            return ` ${value} VND`;
          },
        },
      },
    },
  };

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold uppercase">
          {t("productCategory")}
        </p>
        <p className="text-lg text-[#FF5C00] cursor-pointer">{t("seeAll")}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="w-60 h-60">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="flex flex-col gap-3">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    chartData.datasets[0]?.backgroundColor[index] || "#ccc",
                }}
              ></span>
              <p className="text-base">
                {item.groupBy}: {item.revenue.toLocaleString("vi-VN")} VND
              </p>
            </div>
          ))}
        </div>
      </div>
    </CustomCardItem>
  );
}

import { useTranslation } from "react-i18next";
import { Skeleton } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getOverviewByCategory } from "@/api/overview.service";
import { isValidFilter } from "@/helpers/helpers";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        barThickness: 42,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as "y",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw.toLocaleString("vi-VN");
            return `${value} VND`;
          },
        },
      },
    },
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton active className="h-full" />
      ) : (
        <div style={{ height: "400px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

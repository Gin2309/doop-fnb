import { getOverviewByTime } from "@/api/overview.service";
import { isValidFilter } from "@/helpers/helpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({ formFilter }) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`TIME_OVERVIEW`, formFilter],
    () => getOverviewByTime(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const fromDate = new Date(formFilter?.from);
  const toDate = new Date(formFilter?.to);

  const isSameDay = fromDate.toDateString() === toDate.toDateString();
  const isSameMonth =
    fromDate.getMonth() === toDate.getMonth() &&
    fromDate.getFullYear() === toDate.getFullYear();
  const isSameYear = fromDate.getFullYear() === toDate.getFullYear();
  const hours = isSameDay
    ? Array.from(
        { length: 24 },
        (_, i) =>
          `${i.toString().padStart(2, "0")}:00 - ${(i + 1)
            .toString()
            .padStart(2, "0")}:00`
      )
    : isSameMonth
    ? Array.from(
        { length: 31 },
        (_, i) =>
          `${(i + 1).toString().padStart(2, "0")}-${fromDate.getFullYear()}`
      )
    : isSameYear
    ? Array.from(
        { length: 12 },
        (_, i) =>
          `${(i + 1).toString().padStart(2, "0")}-${fromDate.getFullYear()}`
      )
    : Array.from(
        { length: 10 },
        (_, i) => `${(8 + i).toString().padStart(2, "0")}-00`
      );

  const processedData = data?.data?.reduce((acc, item) => {
    const groupDate = parseInt(item.groupBy.split("-")[0]);
    let index;

    if (isSameDay) {
      index = groupDate;
    } else if (isSameMonth) {
      index = groupDate - 1;
    } else if (isSameYear) {
      index = groupDate - 1;
    } else {
      index = groupDate - 8;
    }

    if (index >= 0 && index < acc.length) {
      acc[index] = (acc[index] || 0) + item.revenue;
    }
    return acc;
  }, new Array(isSameDay ? 24 : isSameMonth ? 31 : isSameYear ? 12 : 10).fill(0));

  const dataset =
    processedData ||
    new Array(isSameDay ? 24 : isSameMonth ? 31 : isSameYear ? 12 : 10).fill(0);

  const chartData = {
    labels: hours,
    datasets: [
      {
        label: t("revenue"),
        data: dataset,
        fill: true,
        backgroundColor: "#FF5C00",
        borderColor: "#FF5C00",
        barThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
        },
        categoryPercentage: 1,
        barPercentage: 1,
      },
      y: {
        grid: {
          display: true,
          color: "#ddd",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton active className="h-full" />
      ) : (
        <div>
          <div style={{ height: "400px" }}>
            <Bar options={options} data={chartData} className="h-full" />
          </div>
          <div className="flex items-center justify-start pt-5 ps-5">
            <div
              style={{ width: 20, height: 20, backgroundColor: "#FF5C00" }}
              className="mr-2"
            ></div>
            <span>{t("revenue")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

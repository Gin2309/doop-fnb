import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { CustomCardItem } from "@/components/CustomCardItem";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getOverviewByTime } from "@/api/overview.service";
import { isValidFilter } from "@/helpers/helpers";
import { Skeleton } from "antd";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: true,
        color: "#ccc",
        lineWidth: 1,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderColor: "#FF736A",
      borderWidth: 2,
      fill: true,
    },
    point: {
      radius: 4,
      backgroundColor: "#FF736A",
    },
  },
};

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
        { length: 12 },
        (_, i) =>
          `${(i * 2).toString().padStart(2, "0")}:00 - ${(i * 2 + 1)
            .toString()
            .padStart(2, "0")}:00`
      )
    : isSameMonth
    ? Array.from(
        { length: Math.ceil(31 / 2) },
        (_, i) =>
          `${(i * 2 + 1).toString().padStart(2, "0")}-${fromDate.getFullYear()}`
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
    const groupDate = item.groupBy.split("-")[0];
    let index;

    if (isSameDay) {
      index = Math.floor(parseInt(groupDate) / 2);
    } else if (isSameMonth) {
      index = Math.floor(parseInt(groupDate) / 2);
    } else if (isSameYear) {
      index = parseInt(groupDate) - 1;
    } else {
      index = parseInt(groupDate) - 8;
    }

    if (index >= 0 && index < (isSameYear ? 12 : isSameMonth ? 16 : 24)) {
      acc[index] = (acc[index] || 0) + item.revenue;
    }
    return acc;
  }, new Array(24).fill(0));

  const dataset =
    processedData || Array(isSameYear ? 12 : isSameMonth ? 16 : 24).fill(0);

  const chartData = {
    labels: hours,
    datasets: [
      {
        label: t("revenue"),
        data: dataset,
        fill: true,
        backgroundColor: "#E4E4E4",
        borderColor: "#FF736A",
      },
    ],
  };

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <p className="text-xl font-semibold uppercase">{t("soldItemQuantity")}</p>
      <div className="flex-1 h-full">
        {isLoading ? (
          <Skeleton active className="h-full" />
        ) : (
          <Line data={chartData} options={options} className="h-full" />
        )}
      </div>
    </CustomCardItem>
  );
}

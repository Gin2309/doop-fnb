import { CustomCardItem } from "@/components/CustomCardItem";
import { useTranslation } from "react-i18next";
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

import { Skeleton } from "antd";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getOverviewByTime } from "@/api/overview.service";
import { isValidFilter } from "@/helpers/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { ticks: { stepSize: 200000 } },
  },
};

export default function ListOverViewTime({ formFilter }) {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(
    [`TIME_OVERVIEW`, formFilter],
    () => getOverviewByTime(formFilter),
    {
      enabled: Boolean(isValidFilter(formFilter)),
    }
  );

  const chartData = {
    labels: (() => {
      const currentTime = dayjs();
      const currentHour = currentTime.hour();
      const labels: string[] = [];

      for (let i = 0; i < 10; i++) {
        const hour = currentHour - (9 - i);
        const formattedHour = dayjs().hour(hour).minute(0).format("hh:00 A");
        labels.push(formattedHour);
      }

      return labels;
    })(),

    datasets: [
      {
        label: t("revenue"),
        data: (() => {
          const currentTime = dayjs();
          const currentHour = currentTime.hour();
          const dataValues = Array(10).fill(0);

          for (let i = 0; i < 10; i++) {
            const hour = currentHour - (9 - i);
            const revenueData = data?.data?.find(
              (item) => parseInt(item.groupBy.split("-")[0]) === hour
            );

            if (revenueData) {
              dataValues[i] = revenueData.revenue;
            } else {
              dataValues[i] = 0;
            }
          }

          return dataValues;
        })(),
        backgroundColor: "#8FBFFF",
        borderRadius: 4,
      },
    ],
  };

  return (
    <CustomCardItem className="p-6 h-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold uppercase">{t("hourlyReports")}</p>
        <p className="text-lg text-[#FF5C00] cursor-pointer">{t("seeAll")}</p>
      </div>

      {isLoading ? (
        <Skeleton active className="h-full" />
      ) : (
        <div className="flex-1 h-full">
          <Bar options={options} data={chartData} className="h-full" />
        </div>
      )}
    </CustomCardItem>
  );
}

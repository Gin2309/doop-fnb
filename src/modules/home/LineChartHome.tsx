import { CustomCardItem } from "@/components/CustomCardItem";
import { useTranslation } from "react-i18next";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Image from "next/image";
import TrendUp from "@/assets/TrendUp.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 2000000,
        callback: function (value) {
          return value / 1000000 + " tr";
        },
        font: {
          size: 14,
        },
      },
    },
  },
};

export default function LineChartHome() {
  const { t } = useTranslation();

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First dataset",
        data: [3300000, 5300000, 8500000, 4100000, 4400000, 6500000],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Second dataset",
        data: [3300000, 2000005, 3500000, 5100000, 5400000, 7600000],
        fill: false,
        borderColor: "#742774",
      },
      {
        label: "Third dataset",
        data: [4300000, 3300000, 5200000, 3500000, 6600000, 7800000],
        fill: true,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1 flex flex-col gap-5 ">
        <p className="text-xl font-semibold mb-5">Đầu tư</p>

        <div className="flex items-center gap-5">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
          <div>
            <div className="flex gap-2">
              <p className="text-xl font-bold">54tr </p>
              <div className="flex items-center">
                <Image width={15} height={15} src={TrendUp} />
                <p className="text-[#009933] text-sm font-semibold ml-1">
                  4.2%
                </p>
              </div>
            </div>
            <p className="font-light">{t("totalRevenue")}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
          <div>
            <div className="flex gap-2">
              <p className="text-xl font-bold">54tr </p>
              <div className="flex items-center">
                <Image width={15} height={15} src={TrendUp} />
                <p className="text-[#009933] text-sm font-semibold ml-1">
                  4.2%
                </p>
              </div>
            </div>
            <p className="font-light">{t("totalRevenue")}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
          <div>
            <div className="flex gap-2">
              <p className="text-xl font-bold">54tr </p>
              <div className="flex items-center">
                <Image width={15} height={15} src={TrendUp} />
                <p className="text-[#009933] text-sm font-semibold ml-1">
                  4.2%
                </p>
              </div>
            </div>
            <p className="font-light">{t("totalRevenue")}</p>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="h-[300px] flex flex-col gap-5">
          <div className="flex-1 h-full">
            <Line options={options} data={data} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

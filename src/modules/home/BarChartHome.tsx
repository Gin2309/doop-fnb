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
import Image from "next/image";
import TrendUp from "@/assets/TrendUp.svg";

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
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        stepSize: 2000000,
        callback: function (value) {
          return value / 1000000 + " tr"; // Chia giá trị cho 1 triệu và thêm ký hiệu "tr"
        },
        font: {
          size: 14,
        },
      },
    },
  },
};
export default function BarChartHome() {
  const { t } = useTranslation();

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July"],
    datasets: [
      {
        label: "First dataset",
        data: [1500000, 2577000, 1555000, 1222000, 5055000, 5800000, 10800000],
        fill: true,
        backgroundColor: "#22C55E",
        borderRadius: 10,
      },
      {
        label: "Second dataset",
        data: [3000000, 4000000, 3000000, 2000000, 6000000, 7000000, 12800000],
        backgroundColor: "#FF4141",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-1 flex flex-col gap-5 ">
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
            <Bar options={options} data={data} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

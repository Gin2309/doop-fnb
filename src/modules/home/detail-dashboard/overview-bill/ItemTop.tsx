import { CustomCardItem } from "@/components/CustomCardItem";
import { formatCurrencyWithoutSymbol } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import TrendUp from "@/assets/TrendUp.svg";
import TrendDown from "@/assets/TrendDown.svg";

import ArrowRightYellow from "@/assets/chevron-right-yellow.svg";

export function ItemOverBillTop({ title, value, difference, des, icon }) {
  const { t } = useTranslation();
  const router = useRouter();

  const differenceColor = difference >= 0 ? "text-[#009933]" : "text-[#FF0000]";
  const trendIcon = difference >= 0 ? TrendUp : TrendDown;

  return (
    <CustomCardItem>
      <div
        className="cursor-pointer p-5"
        onClick={() => router.push(`#`)}
        style={{ boxShadow: "0px 2px 24px 0px rgba(25, 25, 28, 0.04)" }}
      >
        <div className="flex items-center gap-3">
          <Image width={24} height={24} src={icon} />
          <p className="text-xl font-semibold">{title}</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <p className="text-4xl font-semibold">
            {formatCurrencyWithoutSymbol(value)}
            <span className="text-3xl text-[#888]">đ</span>
          </p>

          <div className="flex items-center">
            <Image width={24} height={24} src={trendIcon} />
            <p className={`text-base font-semibold ml-1 ${differenceColor}`}>
              {difference.toFixed(2)}%
            </p>
            <span className="text-[#828487] text-base ml-3">{des}</span>
          </div>
        </div>
      </div>
      <div className="p-5 flex justify-between cursor-pointer">
        <p className="text-[#FF5C00] text-base font-semibold">
          {t("viewDetails")}
        </p>
        <Image src={ArrowRightYellow} />
      </div>
    </CustomCardItem>
  );
}

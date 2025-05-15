import { CustomCardItem } from "@/components/CustomCardItem";
import { formatCurrencyWithoutSymbol } from "@/utils";

export default function ItemOverBillBot({
  color,
  title,
  value,
  difference,
  isAvg,
}) {
  const differenceColor =
    difference > 0 ? "#009933" : difference < 0 ? "#FF3333" : "#828487";
  const differenceSign = difference > 0 ? "+" : difference < 0 ? "−" : "";

  return (
    <CustomCardItem className={`p-3 border-t-[2px] border-[${color}]`}>
      <p className="text-base font-semibold text-[#828487]">{title}</p>

      <div className="my-3 flex items-end">
        <p className="text-2xl font-bold">
          {isAvg ? formatCurrencyWithoutSymbol(value) : value}
          {isAvg && <span className="text-xl text-[#888]">đ</span>}{" "}
          <span className="text-sm" style={{ color: differenceColor }}>
            {differenceSign}
            {Math.abs(difference).toFixed(2)}%
          </span>
        </p>
      </div>
    </CustomCardItem>
  );
}

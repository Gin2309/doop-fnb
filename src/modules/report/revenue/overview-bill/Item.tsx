import { formatCurrencyWithoutSymbol } from "@/utils";
import { PropsWithoutRef } from "react";

export default function ItemOverBill(props: PropsWithoutRef<{
  color,
  title,
  value,
  difference,
  isMoney,
}>) {
  const {
    color,
    title,
    value,
    difference,
    isMoney,
  } = props;
  const differenceColor =
    difference > 0 ? "#009933" : difference < 0 ? "#FF3333" : "#828487";
  const differenceSign = difference > 0 ? "+" : difference < 0 ? "−" : "";

  return (
    <div
      className={`bg-[#fff] rounded-xl p-3 gap-4 flex flex-col shadow-sm relative min-h-[100px]
        border-t-[3px]
      `}
      style={{
        borderTopColor: color
      }}
    >
      <div className="text-[#828487] font-semibold">{title}</div>
      <div className="flex items-end">
        <div className="font-semibold text-[#19191C] text-[18px] mr-1">
          {formatCurrencyWithoutSymbol(value)}
          {isMoney && <span>đ</span>}{" "}
        </div>
        {isMoney && <div style={{ color: differenceColor }}>
          {differenceSign}
          {Math.abs(difference).toFixed(2)}%
        </div>}
      </div>
    </div>
  );
}

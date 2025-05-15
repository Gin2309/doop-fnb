import { Card } from "antd";
import { ItemOverBillTop } from "./ItemTop";

import ForkKnife from "@/assets/ForkKnife.svg";
import Reciept from "@/assets/BlackReceipt.svg";
import CurrencyDollar from "@/assets/CurrencyDollar.svg";
import CancelIcon from "@/assets/XCircle.svg";
import { useTranslation } from "react-i18next";

export default function ListOverBillTop({
  data,
  prevData,
  isLoading,
  calculateDifference,
  comparisonType,
}) {
  const { t } = useTranslation();

  const iconMap = {
    totalProduct: ForkKnife,
    totalTax: Reciept,
    revenueAndTax: CurrencyDollar,
    totalReturn: CancelIcon,
  };

  if (isLoading) {
    return (
      <Card
        className="col-span-4 mt-4"
        loading={isLoading}
        style={{ minHeight: "220px" }}
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        Loading...
      </Card>
    );
  }

  const statItems = [
    {
      key: "totalProduct",
      value: data?.data?.totalProduct ?? 0,
    },
    { key: "totalTax", value: data?.data?.totalTax ?? 0 },
    {
      key: "revenueAndTax",
      value: data?.data?.revenueAndTax ?? 0,
    },
    {
      key: "totalReturn",
      value: data?.data?.totalReturn ?? 0,
    },
  ];

  const getComparisonText = () => {
    if (!["day", "month", "year"].includes(comparisonType)) {
      return t("compareTime");
    }

    switch (comparisonType) {
      case "day":
        return t("compareDay");
      case "month":
        return t("compareMonth");
      case "year":
        return t("compareYear");
      default:
        return t("compareTime");
    }
  };

  return (
    <div className="mt-5 grid grid-cols-2 xl:grid-cols-4 gap-5">
      {statItems.map(({ key, value }) => (
        <ItemOverBillTop
          key={key}
          title={t(key)}
          value={value}
          difference={calculateDifference(value, prevData?.data?.[key])}
          des={getComparisonText()}
          icon={iconMap[key]}
        />
      ))}
    </div>
  );
}

import { Card } from "antd";
import ItemOverBillBot from "./ItemBot";
import { useTranslation } from "react-i18next";

export default function ListOverBillBot({
  data,
  prevData,
  isLoading,
  calculateDifference,
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card
        className="col-span-4"
        loading={isLoading}
        style={{ minHeight: "100px" }}
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

  const ListOverBillBot = [
    {
      key: "countCustomer",
      color: "#8569F6",
      value: data?.data?.countCustomer ?? 0,
    },
    {
      key: "countBill",
      color: "#FF736A",
      value: data?.data?.countBill ?? 0,
    },
    {
      key: "avg",
      color: "#FECF24",
      value: data?.data?.avg ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-5">
      {ListOverBillBot.map(({ key, color, value }) => (
        <ItemOverBillBot
          key={key}
          color={color}
          title={t(key)}
          value={value}
          isAvg={key === "avg"}
          difference={calculateDifference(value, prevData?.data?.[key])}
        />
      ))}
    </div>
  );
}

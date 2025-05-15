import React from "react";
import { useTranslation } from "react-i18next";

import { formatNumber } from "@/helpers";
import CustomTable from "@/components/CustomTable";
import CustomPagination from "@/components/CustomPagination";
import { ColumnsType } from "antd/es/table";

interface WareHouseReportRecord {
  key: number;
  name: string;
  unit: string;
  openingQuantity: number;
  soldQuantity: number;
  increase: number;
  decrease: number;
  min: number;
  closingQuantity: number;
  status: string;
}

const Tab1 = () => {
  const { t } = useTranslation();

  const columns: ColumnsType<WareHouseReportRecord> = [
    {
      title: t("ingredientName"),
      dataIndex: "name",
      key: "name",
      render: (value) => (
        <div className="text-[#3355FF] cursor-pointer">{value}</div>
      ),
    },
    {
      title: t("unit"),
      dataIndex: "unit",
      key: "unit",
      align: "center",
    },
    {
      title: t("openingQuantity"),
      dataIndex: "openingQuantity",
      key: "openingQuantity",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("soldQuantity"),
      dataIndex: "soldQuantity",
      key: "soldQuantity",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("increase"),
      dataIndex: "increase",
      key: "increase",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("decrease"),
      dataIndex: "decrease",
      key: "decrease",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("min"),
      dataIndex: "min",
      key: "min",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("closingQuantity"),
      dataIndex: "closingQuantity",
      key: "closingQuantity",
      align: "center",
      render: (value) => formatNumber(value),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value) => <div className="text-[#E50000]">{value}</div>,
    },
  ];

  const data = [
    {
      key: 1,
      name: "Tôm",
      unit: "kg",
      openingQuantity: 10,
      soldQuantity: 10,
      increase: 10,
      decrease: 10,
      min: 5,
      closingQuantity: 5,
      status: "",
    },
    {
      key: 2,
      name: "Cá",
      unit: "kg",
      openingQuantity: 30,
      soldQuantity: 10,
      increase: 10,
      decrease: 0,
      min: 0,
      closingQuantity: 5,
      status: "Sắp hết",
    },
  ];

  return (
    <>
      <div className="mt-4">
        <CustomTable dataSource={data} columns={columns} />
      </div>

      <CustomPagination page={1} pageSize={10} total={20} />
    </>
  );
};

export default Tab1;

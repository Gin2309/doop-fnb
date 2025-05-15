import React, { useState } from "react";
import CustomTable from "@/components/CustomTable";
import CustomPagination from "@/components/CustomPagination";
import { ColumnsType } from "antd/es/table";
import { formatMoney } from "@/helpers";
import { useTranslation } from "react-i18next";

interface ReportProductRecord {
  key: number;
  categories: string;
  salePrice?: number | any;
  unit: string;
  quantity: number;
  quantityRatio: number;
  total: number;
  moneyRatio: any;
  children?: ReportProductRecord[];
}

const Table = () => {
  const { t } = useTranslation();
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const toggleExpandRow = (key: number) => {
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const columns: ColumnsType<ReportProductRecord> = [
    {
      title: t("categories"),
      dataIndex: "categories",
      key: "categories",
      align: "center",
    },
    {
      title: t("salePrice"),
      dataIndex: "salePrice",
      key: "salePrice",
      align: "center",
      render: (value) => formatMoney(value),
    },
    {
      title: t("unit"),
      dataIndex: "unit",
      key: "unit",
      align: "center",
    },
    {
      title: t("productQuantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (value) => formatMoney(value),
    },
    {
      title: t("quantityRatio"),
      dataIndex: "quantityRatio",
      key: "quantityRatio",
      align: "center",
      render: (value) => formatMoney(value),
    },
    {
      title: t("totalMoney"),
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (value) => formatMoney(value),
    },
    {
      title: t("moneyRatio"),
      dataIndex: "moneyRatio",
      key: "moneyRatio",
      align: "center",
      render: (value) => (
        <span
          style={{
            color:
              value === "Tăng" ? "green" : value === "Giảm" ? "red" : "black",
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  const fakeData: ReportProductRecord[] = [
    {
      key: 1,
      categories: "Đồ ăn",
      salePrice: 123123,
      unit: "",
      quantity: 1500000,
      quantityRatio: 0,
      total: 150000,
      moneyRatio: "Tăng",
      children: [
        {
          key: 11,
          categories: "Cơm rang dưa bò",
          salePrice: 35000,
          unit: "Suất",
          quantity: 0,
          quantityRatio: 50,
          total: 373500,
          moneyRatio: "Tăng",
        },
        {
          key: 12,
          categories: "Phở bò",
          salePrice: 35000,
          unit: "Suất",
          quantity: 0,
          quantityRatio: 25,
          total: 54500,
          moneyRatio: "Tăng",
        },
      ],
    },
    {
      key: 2,
      categories: "Đồ uống",
      salePrice: 20000,
      unit: "",
      quantity: 1000000,
      quantityRatio: 0,
      total: 200000,
      moneyRatio: "Giảm",
      children: [
        {
          key: 21,
          categories: "Boncha Mật ong",
          salePrice: 10000,
          unit: "Chai",
          quantity: 40,
          quantityRatio: 0,
          total: 40000,
          moneyRatio: "Tăng",
        },
        {
          key: 22,
          categories: "Olong Tea Plus",
          salePrice: 10000,
          unit: "Chai",
          quantity: 60,
          quantityRatio: 0,
          total: 60000,
          moneyRatio: "Giảm",
        },
      ],
    },
  ];

  return (
    <>
      <CustomTable
        dataSource={fakeData}
        columns={columns}
        rowClassName={(record) =>
          record.children ? "parent-row hover-row" : "child-row hover-row"
        }
        expandedRowKeys={expandedRowKeys}
        onRow={(record) => ({
          onClick: () => toggleExpandRow(record.key),
        })}
        expandable={{
          expandIcon: () => null,
        }}
      />

      <CustomPagination page={1} pageSize={10} total={20} />
    </>
  );
};

export default Table;

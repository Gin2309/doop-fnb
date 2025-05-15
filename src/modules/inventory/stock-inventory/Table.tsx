import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { formatNumber } from "@/helpers";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import CustomTag from "@/components/CustomTag";
import CustomPagination from "@/components/CustomPagination";
import Search from "@/components/CustomSearch/Search";
import { CustomButton } from "@/components/CustomButton";

import Plus from "@/assets/GrayPlusIcon.svg";
import Minus from "@/assets/GrayMinusIcon.svg";
import QuantityButton from "./CustomButton";

interface Record {
  key: number;
  name: string;
  unit: string;
  minimumQuantity: number;
  endingInventory: number;
  ingredientStatus: string;
}

const Table = ({
  title,
  dataSource,
  type,
}: {
  title: string;
  dataSource: any;
  type: string;
}) => {
  const { t } = useTranslation();

  const color = {
    inStock: "processing",
    outOfStock: "error",
  };

  let nameColumnTitle = "";
  if (type === "ingredient") {
    nameColumnTitle = t("ingredientName");
  } else if (type === "product") {
    nameColumnTitle = t("productsName");
  }

  const columns: ColumnsType<Record> = [
    {
      title: nameColumnTitle,
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("unit"),
      dataIndex: "unit",
      key: "unit",
      render: (value: string) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
        >
          {value}
        </button>
      ),
      align: "center",
    },
    {
      title: t("minimumQuantity"),
      dataIndex: "minimumQuantity",
      key: "minimumQuantity",
      align: "center",
      render: (value: number) => formatNumber(value),
    },
    {
      title: t("endingInventory"),
      dataIndex: "endingInventory",
      key: "endingInventory",
      render: (value: number) => {
        return value == 0 ? (
          <span style={{ color: "#E50000" }}>{formatNumber(value)}</span>
        ) : (
          formatNumber(value)
        );
      },
      align: "center",
    },
    {
      title: t("status"),
      dataIndex: "ingredientStatus",
      key: "ingredientStatus",
      align: "center",
      render: (value: string) => (
        <CustomTag title={t(value)} color={color[value]} />
      ),
    },
    {
      title: t("inventoryAction"),
      dataIndex: "inventoryAction",
      key: "inventoryAction",
      align: "center",
      render: () => {
        return (
          <>
            <div className="flex gap-2 justify-center">
              <QuantityButton
                prefixIcon={<Image src={Minus} onClick={() => {}} />}
              />

              <QuantityButton
                prefixIcon={<Image src={Plus} />}
                onClick={() => {}}
              />
            </div>
          </>
        );
      },
    },
  ];

  const menuItems = [
    {
      key: "title",
      label: (
        <span style={{ color: "#666666", fontWeight: 500 }}>
          Hiển thị hóa đơn theo:
        </span>
      ),
      type: "group",
    },
    {
      key: "1",
      label: "Thu ngân",
    },
    {
      key: "2",
      label: "Loại hình",
    },
  ];

  return (
    <>
      <Search title={t(title)} items={menuItems} />

      <div className="mt-6">
        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={dataSource}
          columns={columns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination page={1} pageSize={10} total={20} />
      </div>
    </>
  );
};

export default Table;

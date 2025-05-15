import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { formatNumber } from "@/helpers";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { CustomInput } from "@/components/CustomInput";
import { CustomButton } from "@/components/CustomButton";
import { CustomSelect } from "@/components/CustomSelect";

import SortingIcon from "@/assets/column-sorting.svg";
import CloseIcon from "@/assets/CloseIcon2.svg";

interface Record {
  key: number;
  name: string;
  unit: string;
  quantity: number;
}

const Table = ({ dataSource }: { dataSource: any }) => {
  const { t } = useTranslation();

  const unitGroup = {
    data: {
      items: [
        { id: "1", name: t("Chai") },
        { id: "2", name: t("Lốc") },
      ],
    },
  };

  const columns: ColumnsType<Record> = [
    {
      title: t("itemIngredientName"),
      dataIndex: "name",
      key: "name",
      //   align: "center",
      //   render: (value: string) => (
      //     <CustomInput
      //       onChange={(value: any) => console.log(value)}
      //       className="suffix-icon h-11 !rounded"
      //       placeholder="Nhập tên nguyên liệu/sản phẩm"
      //       value={value}
      //     />
      //   ),
    },
    {
      title: t("unit"),
      dataIndex: "unit",
      key: "unit",
      width: "200px",
      render: (value: string) => (
        <CustomSelect
          onChange={(value) => console.log(value)}
          options={unitGroup?.data?.items?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          showSearch={true}
          className="suffix-icon h-11 !rounded"
          placeholder="Chọn chi nhánh"
          value={value}
          suffixIcon={
            <div className="flex items-center">
              <Image src={SortingIcon} alt="" />
            </div>
          }
        />
      ),
      align: "center",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "200px",
      render: (value: string) => (
        <CustomInput
          onChange={(value: any) => console.log(value)}
          className="suffix-icon h-11 !rounded"
          type="number"
          placeholder="Nhập số lượng"
          value={formatNumber(value)}
        />
      ),
    },
    {
      title: t(""),
      dataIndex: "action",
      key: "action",
      width: "100px",
      align: "center",
      render: () => {
        return (
          <>
            <div>
              <Image src={CloseIcon} />
            </div>
          </>
        );
      },
    },
  ];

  const locale = {
    emptyText: (
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#666666",
            fontSize: 14,
          }}
        >
          {t("selectItemIngredient")}
        </p>
      </div>
    ),
  };

  return (
    <>
      <div className="mt-6">
        <CustomTable
          dataSource={dataSource}
          locale={locale}
          columns={columns}
          rowClassName={() => "hover-row"}
        />
      </div>
    </>
  );
};

export default Table;

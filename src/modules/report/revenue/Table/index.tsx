import React from "react";
import { useTranslation } from "react-i18next";

import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { formatMoney } from "@/helpers";

import CustomPagination from "@/components/CustomPagination";

interface ReportRecord {
  key: number;
  day: string;
  date: string;
  productAmount: number;
  cancelAmount: number;
  refundAmount: number;
  discount: number;
  comboDiscount: number;
  tax: number;
  serviceFee: number;
  deliveryFee: number;
  deliveryPartnerAmount: number;
}

const Table = ({ data }: { data: any }) => {
  const { t } = useTranslation();

  const columns: ColumnsType<ReportRecord> = [
    {
      title: t("day"),
      dataIndex: "day",
      key: "day",
      align: "center",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "date",
      align: "center",
    },
    {
      title: t("productAmount"),
      dataIndex: "productAmount",
      key: "productAmount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("cancelAmount"),
      dataIndex: "cancelAmount",
      key: "cancelAmount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("refundAmount"),
      dataIndex: "refundAmount",
      key: "refundAmount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("discount"),
      dataIndex: "discount",
      key: "discount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("comboDiscount"),
      dataIndex: "comboDiscount",
      key: "comboDiscount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("tax"),
      dataIndex: "tax",
      key: "tax",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("serviceFee"),
      dataIndex: "serviceFee",
      key: "serviceFee",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("deliveryFee"),
      dataIndex: "deliveryFee",
      key: "deliveryFee",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
    {
      title: t("deliveryPartnerAmount"),
      dataIndex: "deliveryPartnerAmount",
      key: "deliveryPartnerAmount",
      render: (value: number) => formatMoney(value),
      align: "center",
    },
  ];

  return (
    <>
      <div className="mb-2">
        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={data}
          columns={columns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination page={1} pageSize={10} total={20} />
      </div>
    </>
  );
};

export default Table;

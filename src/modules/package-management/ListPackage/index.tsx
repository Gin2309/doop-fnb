import { useTranslation } from "react-i18next";
import Image from "next/image";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPackage } from "@/api/package.service";
import { formatMoney } from "@/helpers";
import { formatDate } from "@/utils";
import CustomTag from "@/components/CustomTag";

interface PackageRecord {
  id: number;
  key: number;
  code: number;
  name: string;
  creator: string;
  createdAt: string;
  type: string;
  price: number;
  status: string;
}

const color = {
  ACTIVE: "success",
};

const title = {
  ACTIVE: "active",
};

const typeTitle = {
  PAID: "paid",
  TRIAL: "trial",
};

const PackageList = () => {
  const { t } = useTranslation();

  const { data: packages } = useQuery(["LIST_PACKAGE"], () => getPackage());

  const columns: ColumnsType<PackageRecord> = [
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_value: any, _record: PackageRecord, index: number) => index + 1,
    },
    {
      title: t("packageName"),
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: t("creator"),
      dataIndex: "creatorName",
      key: "creatorName",
      align: "center",
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => formatDate(value),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (value: string) => t(typeTitle[value]) || value,
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value: string) => formatMoney(value),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: string) => {
        return <CustomTag title={title[value]} color={color[value]} />;
      },
    },
  ];

  return (
    <>
      <CustomTable
        dataSource={packages?.data}
        columns={columns}
        rowClassName={() => "hover-row"}
      />
    </>
  );
};

export default PackageList;

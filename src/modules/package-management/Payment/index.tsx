import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { message } from "antd";

import { formatMoney } from "@/helpers";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import Printer from "@/assets/Printer.svg";

import Close from "@/assets/smallCross.svg";
import Download from "@/assets/DownloadSimpleBlue.svg";
import { CustomCardItem } from "@/components/CustomCardItem";
import { useQuery } from "@tanstack/react-query";
import { getPayment } from "@/api/package.service";
import { CustomButton } from "@/components/CustomButton";
import { formatTimeWithSeconds } from "@/utils";
import CustomPagination from "@/components/CustomPagination";
import CustomTag from "@/components/CustomTag";

interface PurchaseRecord {
  key: number;
  date: string;
  package: string;
  amount: number;
  paymentMethod: string;
  payer: string;
  invoice: string;
  note: number;
}

const titleStatus = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Thành công",
};

const colorStatus = {
  PENDING: "orange",
  CONFIRMED: "success",
};

const Payment = () => {
  const { t } = useTranslation();

  const handleDownload = async (url: any) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Không thể tải tài liệu. Vui lòng thử lại sau.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = url.split("/").pop();
      link.click();
    } catch (error: any) {
      message.error("Đã xảy ra lỗi trong quá trình tải xuống.");
    }
  };

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    branchId: "",
    sort: "createdAt",
  });

  const { data: payments } = useQuery(
    [
      "PAYMENT",
      formFilter.page,
      formFilter.limit,
      formFilter.branchId,
      formFilter.sort,
    ],
    () => getPayment(formFilter)
  );

  const columns: ColumnsType<PurchaseRecord> = [
    {
      title: t("index"),
      dataIndex: "index",
      key: "index",
      align: "start",
      render: (_value: any, _record: any, index: number) => index + 1,
    },
    {
      title: t("paymentDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "start",
      render: (value) => formatTimeWithSeconds(value),
    },
    {
      title: t("paymentPackage"),
      dataIndex: "packageName",
      key: "packageName",
      align: "start",
    },
    {
      title: t("totalAmount"),
      dataIndex: "transferAmount",
      key: "transferAmount",
      align: "start",
      render: (value: number) => formatMoney(value),
    },
    {
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "start",
      render: (value: string) => t(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "start",
      render: (value: string) => {
        return (
          <CustomTag title={titleStatus[value]} color={colorStatus[value]} />
        );
      },
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
      align: "start",
    },
    {
      title: t("issuedInvoice"),
      dataIndex: "billLink",
      key: "billLink ",
      align: "center",
      render: (value: string, record: any) => {
        return value ? (
          <div
            className="text-[#1890ff] cursor-pointer"
            onClick={() => handleDownload(value)}
          >
            <div className="flex items-center justify-center">
              <div className="mr-1">{record?.billCode}</div>
              <Image src={Download} alt="Download icon" />
            </div>
          </div>
        ) : null;
      },
    },
    {
      title: t("note"),
      dataIndex: "note",
      key: "note",
      align: "start",
    },
  ];

  return (
    <>
      <CustomCardItem className="p-6 h-full ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold uppercase">Lịch sử thanh toán</p>
          <div className="flex gap-2">
            <CustomButton
              type="download-btn"
              prefixIcon={<Image src={Download} />}
            >
              {t("download")}
            </CustomButton>
            <CustomButton type="print-btn" prefixIcon={<Image src={Printer} />}>
              {t("printList")}
            </CustomButton>
          </div>
        </div>

        <CustomTable
          dataSource={payments?.data?.content}
          columns={columns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
          total={payments?.data?.totalElements}
        />
      </CustomCardItem>
    </>
  );
};

export default Payment;

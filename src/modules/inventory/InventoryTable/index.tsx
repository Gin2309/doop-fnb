import { useTranslation } from "react-i18next";
import Link from "next/link";

import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import CustomTag from "@/components/CustomTag";
import CustomPagination from "@/components/CustomPagination";
import Search from "../InventorySearch/Search";

import { formatMoney, formatNumber } from "@/helpers";

interface StockRecord {
  key: number;
  createdTime: string;
  referenceCode: string;
  receiptType: string;
  receiptName: string;
  quantity: number;
  stockImportValue: number;
  creator: string;
  stockStatus: string;
  unit: string;
}

const InventoryTable = ({
  dataSource,
  locale,
}: {
  dataSource: any;
  locale: any;
}) => {
  const { t } = useTranslation();

  const color = {
    stockIn: "purple",
    stockOut: "purple",
    order: "geekblue",
  };

  const columns: ColumnsType<StockRecord> = [
    {
      title: t("createdTime"),
      dataIndex: "createdTime",
      key: "createdTime",
      align: "center",
    },
    {
      title: t("referenceCode"),
      dataIndex: "referenceCode",
      key: "referenceCode",
      align: "center",
      render: (text: string, record: StockRecord) => (
        // <Link href={`/inventory/stock-in/${record.key}`}>
        <div
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
        >
          {text}
        </div>
        // </Link>
      ),
    },
    {
      title: t("receiptType"),
      dataIndex: "receiptType",
      key: "receiptType",
      align: "center",
      render: (value: string) => t(value),
    },
    {
      title: t("receiptName"),
      dataIndex: "receiptName",
      key: "receiptName",
      align: "center",
      render: (value: string) => t(value),
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (value: number, record: StockRecord) => (
        <span>
          {formatNumber(value)} {t(record.unit)}
        </span>
      ),
    },
    {
      title: t("stockImportValue"),
      dataIndex: "stockImportValue",
      key: "stockImportValue",
      align: "center",
      render: (value: number) => <span>{formatMoney(value)}</span>,
    },
    {
      title: t("creator"),
      dataIndex: "creator",
      key: "creator",
      align: "center",
      render: (value: string) => t(value),
    },
    {
      title: t("status"),
      dataIndex: "stockStatus",
      key: "stockStatus",
      align: "center",
      render: (value: string) => (
        <CustomTag title={t(value)} color={color[value]} />
      ),
    },
  ];

  return (
    <>
      <div className="card">
        <Search title={t("searchByReceiptCodeOrName")} />

        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          locale={locale}
          dataSource={dataSource}
          columns={columns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination page={1} pageSize={10} total={20} />
      </div>
    </>
  );
};

export default InventoryTable;

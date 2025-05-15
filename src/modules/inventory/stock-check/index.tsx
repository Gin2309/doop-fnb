import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import Image from "next/image";
import CustomTable from "@/components/CustomTable";
import CustomTag from "@/components/CustomTag";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import CustomPagination from "@/components/CustomPagination";
import { useRouter } from "next/router";
import { CustomCardItem } from "@/components/CustomCardItem";
import { useEffect, useState } from "react";

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

const StockCheck = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 550);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dataSource = [
    {
      key: 1,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptName: "Nhập rau 1408",
      creator: "Chu Dung",
      stockStatus: "stockIn",
    },
    {
      key: 2,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptName: "Nhập rau 1408",
      creator: "Chu Dung",
      stockStatus: "order",
    },
    {
      key: 3,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptName: "Nhập rau 1408",
      creator: "Chu Dung",
      stockStatus: "stockOut",
    },
    {
      key: 4,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptName: "Nhập rau 1408",
      creator: "Chu Dung",
      stockStatus: "order",
    },
    {
      key: 5,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptName: "Nhập rau 1408",
      creator: "Chu Dung",
      stockStatus: "stockOut",
    },
  ];

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
        <div
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
        >
          {text}
        </div>
      ),
    },

    {
      title: t("receiptName"),
      dataIndex: "receiptName",
      key: "receiptName",
      align: "center",
      render: (value: string) => t(value),
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
        <CustomTag title={value} color={color[value]} />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>Tất cả phiếu kiểm kê</Title>
        <div>
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            className={`${isSmallScreen ? "no-text" : ""}`}
            onClick={() => router.push("/inventory/stock-check/add")}
          >
            Thêm phiếu kiểm kê
          </CustomButton>
        </div>
      </div>

      <CustomCardItem>
        <div className="card">
          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            dataSource={dataSource}
            columns={columns}
            onRow={(record) => ({
              onClick: () =>
                router.push(`/inventory/stock-check/${record.key}`),
            })}
            rowClassName={() => "hover-row"}
          />

          <CustomPagination page={1} pageSize={10} total={20} />
        </div>
      </CustomCardItem>
    </>
  );
};

export default StockCheck;

import Title from "@/components/Title";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import Image from "next/image";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "next/router";
import CustomPagination from "@/components/CustomPagination";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { formatMoney } from "@/helpers";
import { useEffect, useState } from "react";

interface StockRecord {
  key: number;
  code: string;
  title: string;
  phone: number;
  email: string;
  paid: number;
  total: number;
}
const dataSource = [
  {
    key: 1,
    code: "KK000024",
    title: "Thịt bò Fuji",
    phone: "0123456789",
    email: "chudung@gmail.com",
    paid: 2000000,
    total: 100000000,
  },
  {
    key: 1,
    code: "KK000024",
    title: "Thịt bò Fuji",
    phone: "0123456789",
    email: "chudung@gmail.com",
    paid: 2000000,
    total: 100000000,
  },
  {
    key: 1,
    code: "KK000024",
    title: "Thịt bò Fuji",
    phone: "0123456789",
    email: "chudung@gmail.com",
    paid: 2000000,
    total: 100000000,
  },
  {
    key: 1,
    code: "KK000024",
    title: "Thịt bò Fuji",
    phone: "0123456789",
    email: "chudung@gmail.com",
    paid: 2000000,
    total: 100000000,
  },
];

const columns: ColumnsType<StockRecord> = [
  {
    title: "Mã đối tác",
    dataIndex: "code",
    key: "code",
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
    title: "Tên đối tác",
    dataIndex: "title",
    key: "title",
    align: "center",
  },

  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "center",
  },
  {
    title: "Nợ cần trả hiện tại",
    dataIndex: "paid",
    key: "paid",
    align: "center",
    render: (value: number) => formatMoney(value),
  },
  {
    title: "Tổng mua",
    dataIndex: "total",
    key: "total",
    align: "center",
    render: (value: number) => formatMoney(value),
  },
];

const Partner = () => {
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

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>Danh sách đổi tác</Title>
        <div>
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            className={`${isSmallScreen ? "no-text" : ""}`}
            onClick={() => router.push("/inventory/partner-managements/add")}
          >
            Thêm mới đối tác
          </CustomButton>
        </div>
      </div>

      <div className="card">
        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={dataSource}
          columns={columns}
          onRow={(record) => ({
            onClick: () =>
              router.push(`/inventory/partner-managements/${record.key}`),
          })}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination page={1} pageSize={10} total={20} />
      </div>
    </>
  );
};

export default Partner;

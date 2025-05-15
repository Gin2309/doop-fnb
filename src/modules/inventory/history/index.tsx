import { CustomCardItem } from "@/components/CustomCardItem";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import CustomTag from "@/components/CustomTag";
import Title from "@/components/Title";
import { Dropdown, MenuProps, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import { CustomInput } from "@/components/CustomInput";
import SearchIcon from "@/assets/searchIcon.svg";
interface StockRecord {
  key: number;
  createdTime: string;
  receiptName: string;
  note: string;
  referenceCode: string;
  change: string;
  remain: string;
}

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <span>Mặt hàng 1</span>,
  },
  {
    key: "2",
    label: <span>Mạt hàng 2</span>,
  },
  {
    key: "3",
    label: <span>Mặt hàng 3</span>,
  },
];

const History = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dataSource = [
    {
      key: 2,
      createdTime: "14/08/2024 09:02",
      receiptName: "Cốc",
      note: "Kiểm kê kho phiếu KK000002",
      referenceCode: "NK000024",
      change: "+50",
      remain: "65",
    },
    {
      key: 2,
      createdTime: "14/08/2024 09:02",
      receiptName: "Cốc",
      note: "Kiểm kê kho phiếu KK000002",
      referenceCode: "NK000024",
      change: "+50",
      remain: "65",
    },
    {
      key: 2,
      createdTime: "14/08/2024 09:02",
      receiptName: "Cốc",
      note: "Kiểm kê kho phiếu KK000002",
      referenceCode: "NK000024",
      change: "+50",
      remain: "65",
    },
    {
      key: 2,
      createdTime: "14/08/2024 09:02",
      receiptName: "Cốc",
      note: "Kiểm kê kho phiếu KK000002",
      referenceCode: "NK000024",
      change: "+50",
      remain: "65",
    },
  ];

  const columns: ColumnsType<StockRecord> = [
    {
      title: t("createdTime"),
      dataIndex: "createdTime",
      key: "createdTime",
      align: "center",
    },
    {
      title: "Nguyên liệu mặt hàng",
      dataIndex: "receiptName",
      key: "receiptName",
      align: "center",
      render: (value: string) => t(value),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      render: (value: string) => t(value),
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
      title: "Thay đổi",
      dataIndex: "change",
      key: "change",
      align: "center",
    },
    {
      title: "Còn lại",
      dataIndex: "remain",
      key: "remain",
      align: "center",
    },
  ];

  return (
    <>
      <Title>inventoryHistory</Title>

      <CustomCardItem>
        <div className="card">
          <div className="flex items-center mb-[20px]">
            <Space.Compact block>
              <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
                <Dropdown menu={{ items }}>
                  <Space>
                    <div className="flex items-center">
                      <Image src={FilterIcon} />
                      <span className="mx-2 cursor-pointer">
                        Lọc nguyên liệu/mặt hàng
                      </span>
                      <Image src={DropIcon} />
                    </div>
                  </Space>
                </Dropdown>
              </div>
              <CustomInput
                placeholder="Tìm kiếm "
                prefixIcon={<Image src={SearchIcon} alt="" />}
                className="w-[332px] h-[36px]"
                onChange={() => {}}
              />
            </Space.Compact>
          </div>
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
      </CustomCardItem>
    </>
  );
};

export default History;

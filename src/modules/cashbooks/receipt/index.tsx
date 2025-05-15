import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import Title from "@/components/Title";
import { formatMoney } from "@/helpers";
import { Dropdown, MenuProps, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import EditIcon from "@/assets/Pencil.svg";
import ExportIcon from "@/assets/export.svg";
import ImportIcon from "@/assets/Import.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import Item1 from "@/assets/images/item1.png";
import CustomTag from "@/components/CustomTag";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <span>Phiếu thu 1</span>,
  },
  {
    key: "2",
    label: <span>Phiếu thu 2</span>,
  },
  {
    key: "3",
    label: <span>Phiếu thu 3</span>,
  },
];

const columns: ColumnsType<any> = [
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Mã phiếu thu",
    dataIndex: "code",
    key: "code",
    render: (title) => <span className="text-[#3355FF]">{title}</span>,
  },
  {
    title: "Loại phiếu thu",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Người tạo",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Số tiền thu",
    dataIndex: "price",
    key: "price",
    render: (value: number) => formatMoney(value),
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment-method",
    key: "payment-method",
    render: (value: number) => formatMoney(value),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
  },
];

const Receipt = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedList = [
    {
      key: 1,
      index: 1,
      createdAt: "22/08/2024",
      code: 12345678,
      type: "Thu nợ khách hàng",
      user: "Hà",
      price: 50000,
      paymentMethod: "Tiền mặt",
      status: "Hoàn thành",
    },
    {
      key: 1,
      index: 1,
      createdAt: "22/08/2024",
      code: 12345678,
      type: "Thu nợ khách hàng",
      user: "Hà",
      price: 50000,
      paymentMethod: "Tiền mặt",
      status: "Hoàn thành",
    },
    {
      key: 1,
      index: 1,
      createdAt: "22/08/2024",
      code: 12345678,
      type: "Thu nợ khách hàng",
      user: "Hà",
      price: 50000,
      paymentMethod: "Tiền mặt",
      status: "Hoàn thành",
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <Title>Danh sách phiếu thu</Title>
        <div style={{ marginTop: 15 }}>
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => router.push("/cashbooks/receipt/add-receipt")}
          >
            Tạo phiếu thu
          </CustomButton>
        </div>
      </div>

      <div className="flex items-center mb-4 py-2 ">
        <CustomButton
          type="export"
          className="!rounded-[50px]"
          prefixIcon={<Image src={ExportIcon} />}
        >
          {t("exportList")}
        </CustomButton>
        <div className="w-[12px] border-[1px] rotate-[-90deg] mx-[5px] border-[#B2B2B2]"></div>
        <CustomButton
          type="export"
          className="!rounded-[50px]"
          prefixIcon={<Image src={ImportIcon} />}
        >
          {t("importList")}
        </CustomButton>
      </div>

      <div className="bg-white p-4 rounded-[12px]">
        <div className="flex justify-between pb-[10px] mb-[15px]">
          <div className="flex items-center">
            <Space.Compact block>
              <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
                <Dropdown menu={{ items }}>
                  <Space>
                    <div className="flex items-center">
                      <Image src={FilterIcon} />
                      <span className=" mx-2 cursor-pointer">
                        Lọc phiếu thu
                      </span>
                      <Image src={DropIcon} />
                    </div>
                  </Space>
                </Dropdown>
              </div>
              <CustomInput
                placeholder="Tìm kiếm "
                prefixIcon={<Image src={SearchIcon} alt="" />}
                className="w-[264px] h-[36px]"
                onChange={() => {}}
              />
            </Space.Compact>
          </div>
        </div>

        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={selectedList?.map((item: any, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
        />

        <CustomPagination page={1} pageSize={10} total={100} />
      </div>
    </>
  );
};

export default Receipt;

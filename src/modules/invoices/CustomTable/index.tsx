import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { Divider, Dropdown } from "antd";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { formatMoney } from "@/helpers";
import { formatTime } from "@/utils";
import CustomTag from "@/components/CustomTag";
import DisplaySetting from "@/components/CustomDisplaySetting/DisplaySetting";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";

import InvoicesModal from "@/modules/pos/invoice/components/CustomInvoicesModal/InvoicesModal";
import CustomPagination from "@/components/CustomPagination";

import NotFound from "@/assets/images/InvoicesNotFound.png";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import Close from "@/assets/smallCross.svg";
import searchIcon from "@/assets/searchIcon.svg";
import filterIcon from "@/assets/filter.svg";
import ArrowIcon from "@/assets/arrowIcon.svg";
import ModalCancelPosition from "@/modules/pos/invoice/components/ModalCancel";

const getTagColor = {
  DONE: "success",
  CANCEL: "error",
  REFUND: "warning",
  CREDIT: "default",
  default: "default",
};

const getTagTitle = {
  DONE: "Đã thanh toán",
  CANCEL: "Đã hủy",
  REFUND: "Hoàn tiền",
  CREDIT: "Ghi nợ",
};

const Table = ({
  data,
  isLoading,
  setFormFilter,
  formFilter,
}: {
  data: any;
  isLoading: boolean;
  setFormFilter: any;
  formFilter: any;
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [openCancelPosition, setOpenCancelPositon] = useState(false);
  const [Id, setId] = useState<string | null>(null);

  const locale = {
    emptyText: (
      <div className="text-center my-12">
        <Image src={NotFound} alt="No Data" />
        <p className="text-gray-800 font-semibold mt-5 text-xl">
          {t("notFoundInvoices")}
        </p>
      </div>
    ),
  };

  const handleOpenCancelModal = () => {
    setOpenCancelPositon(true);
    setId(selectedRecord.currentBillId);
    setSelectedRecord(null);
  };

  const initialColumns: ColumnsType<any> = [
    {
      key: "1",
      title: t("paymentTime"),
      dataIndex: "createdAt",
      align: "center",
      render: (value: any) => {
        return value ? formatTime(value) : "-";
      },
    },
    {
      key: "2",
      title: t("referenceCode"),
      dataIndex: "code",
      render: (text: string, record: any) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick(record)}
        >
          {text}
        </button>
      ),
      align: "center",
    },
    {
      key: "3",
      title: t("cashier"),
      dataIndex: "employeeNameStart",
      align: "center",
    },
    {
      key: "4",
      title: t("type"),
      dataIndex: "type",
      align: "center",
      render: (value: string) => {
        if (value === "TABLE") {
          return t("dineIn");
        }
        return value;
      },
    },
    {
      key: "5",
      title: t("orderNameOrArea"),
      dataIndex: "positionCode",
      align: "center",
      render: (value: any, record: any) => (
        <>
          <div className="text-center">
            <h1>{value}</h1>
            <h2 className="text-[#666666] italic">{record.positionName}</h2>
          </div>
        </>
      ),
    },
    {
      key: "6",
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      render: (value: string) => {
        if (value === "BANK") {
          return t("bankTransfer");
        } else if (value === "CASH") {
          return t("cash");
        } else if (value === "CARD") {
          return t("creditCard");
        }
        return value;
      },
      align: "center",
    },
    {
      key: "7",
      title: t("status"),
      dataIndex: "status",
      align: "center",
      render: (value: string) => {
        return (
          <CustomTag
            title={getTagTitle[value]}
            color={getTagColor[value] || getTagColor.default}
          />
        );
      },
    },
    {
      key: "8",
      title: t("totalAmount"),
      dataIndex: "totalPrice",
      render: (value: number) => (value ? formatMoney(value) : "-"),
      align: "center",
    },
    {
      key: "9",
      title: t("totalTime"),
      dataIndex: "totalTime",
      align: "center",
      render: (value: any) => (value ? `${value} mins` : "-"),
    },
    {
      key: "10",
      title: t("numberOfCustomers"),
      dataIndex: "numberOfCustomers",
      align: "center",
      render: (value: number) => (value ? value : "-"),
    },
    {
      key: "11",
      title: t("orderName"),
      dataIndex: "orderName",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      key: "12",
      title: t("partner"),
      dataIndex: "partner",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      key: "13",
      title: t("equipments"),
      dataIndex: "equipments",
      align: "center",
      render: (value: string) => (value ? value : "-"),
    },
    {
      key: "14",
      title: t("orderStatus"),
      dataIndex: "orderStatus",
      align: "center",
      render: (value: string) => (value ? t(value) : "-"),
    },
    {
      key: "15",
      title: t("requestVATInvoice"),
      dataIndex: "requestVATInvoice",
      align: "center",
      render: (value: string) => (value ? t(value) : "-"),
    },
  ];

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleInputChange = (value) => {
    setFormFilter((prevFilter) => ({
      ...prevFilter,
      keyword: value,
    }));
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedRecord(null);
  };

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
    {
      key: "3",
      label: "Ngày tạo",
    },
    {
      key: "4",
      label: "Trạng thái",
    },
  ];

  const initialOptions = [
    { label: t("referenceCode"), checked: true, disabled: true, key: "2" },
    { label: t("totalTime"), checked: false, disabled: false, key: "9" },
    { label: t("cashier"), checked: true, disabled: false, key: "3" },
    {
      label: t("numberOfCustomers"),
      checked: false,
      disabled: false,
      key: "10",
    },
    { label: t("type"), checked: true, disabled: false, key: "4" },
    { label: t("orderName"), checked: false, disabled: false, key: "11" },
    { label: t("paymentMethod"), checked: true, disabled: false, key: "6" },
    { label: t("partner"), checked: false, disabled: false, key: "12" },
    { label: t("equipments"), checked: false, disabled: false, key: "13" },
    { label: t("paymentStatus"), checked: true, disabled: false, key: "7" },
    { label: t("orderStatus"), checked: false, disabled: false, key: "14" },
    { label: t("totalAmount"), checked: true, disabled: true, key: "8" },
    {
      label: t("requestVATInvoice"),
      checked: false,
      disabled: false,
      key: "15",
    },
  ];

  const [options, setOptions] = useState(initialOptions);

  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    const updatedColumns = initialColumns.filter((col) =>
      options.some((opt) => opt.key === col.key && opt.checked)
    );
    setColumns(updatedColumns);
  }, [options]);

  const handleSaveOptions = (updatedOptions) => {
    setOptions(updatedOptions);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="xs:max-w-[320px] md:max-w-[426px] grid grid-cols-7">
              <div className="col-span-3">
                <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
                  <CustomInput
                    onChange={() => {}}
                    className="suffix-icon h-11 !rounded-tl-lg !rounded-bl-lg !rounded-r-none border-r-0"
                    placeholder={"Lọc hóa đơn"}
                    prefix={<Image src={filterIcon} alt="filter icon" />}
                    suffix={<Image src={ArrowIcon} alt="arrow icon" />}
                  />
                </Dropdown>
              </div>
              <div className="col-span-4">
                <CustomInput
                  onChange={handleInputChange}
                  className="suffix-icon h-11 !rounded-tr-lg !rounded-br-lg !rounded-l-none"
                  placeholder={t("search")}
                  prefix={<Image src={searchIcon} alt="search icon" />}
                />
              </div>
            </div>
          </div>
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

        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-[#464F60] font-medium">Filter: 2</span>
            <Divider type="vertical" />
            <span className="text-[#FF5C00] font-medium cursor-pointer">
              Clear all
            </span>
          </div>

          <DisplaySetting options={options} onSave={handleSaveOptions} />
        </div>

        {/* 
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="flex bg-[#EDF1FC] rounded-[4px] px-2 py-1 gap-1 font-medium">
              <span className="text-[#3355FF]">Thanh toán:</span>Tiền mặt,
              Chuyển khoản{" "}
              <Image
                src={Close}
                height={16}
                width={16}
                className="cursor-pointer"
              />
            </div>
            <div className="flex bg-[#EDF1FC] rounded-[4px] px-2 py-1 gap-1 font-medium">
              <span className="text-[#3355FF]">Tổng tiền:</span>1tr - 2tr{" "}
              <Image
                src={Close}
                height={16}
                width={16}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DisplaySetting options={options} onSave={handleSaveOptions}/>
        </div> */}
      </div>

      <div>
        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          locale={locale}
          dataSource={data}
          loading={isLoading}
          columns={columns}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          total={data?.data?.totalElements}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        />
      </div>

      <ModalCancelPosition
        isOpen={openCancelPosition}
        onCancel={() => setOpenCancelPositon(false)}
        id={Id}
        type="BILL"
        setId={setId}
      />

      {selectedRecord && (
        <InvoicesModal
          open={open}
          onClose={handleCancel}
          data={selectedRecord}
          openCancelModal={handleOpenCancelModal}
        />
      )}
    </>
  );
};

export default Table;

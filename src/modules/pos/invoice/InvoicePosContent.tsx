import { useState } from "react";
import { useRouter } from "next/router";
import { Dropdown } from "antd";
import Image from "next/image";
import CustomTabs from "@/components/CustomMiniTabs";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";

import ThreeDot from "@/assets/DotsThree.svg";
import ArrowsOutLineHorizontal from "@/assets/SlpitBill.svg";
import ArrowsInLineHorizontal from "@/assets/MergeBill.svg";
import Payment from "@/assets/CurrencyCircleDollar.svg";
import FileX from "@/assets/DeleteBill.svg";
import Reciept from "@/assets/BlackReceipt.svg";

import { formatMoney } from "@/helpers";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import CustomPagination from "@/components/CustomPagination";
import InvoicesModal from "./components/CustomInvoicesModal/InvoicesModal";
import ModalCancelBill from "./components/ModalCancel";
import ExportVatModal from "./ExportVatModal";
import CustomTag from "@/components/CustomTag";
import { formatTime } from "@/utils";

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

const tabs = [
  { key: "current", label: "Chưa thanh toán" },
  { key: "paid", label: "Đã thanh toán" },
];

export default function InvoicePosContent({
  data,
  setFormFilter,
  formFilter,
  isLoading,
  isLoading2,
  setData,
  keyData,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(keyData || "current");
  const [open2, setOpen2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCancelPosition, setOpenCancelPositon] = useState(false);
  const [Id, setId] = useState<string | null>(null);
  const [openVat, setOpenVat] = useState(false);

  const openInvoiceAction: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span
          onClick={() =>
            router.push(`/pos/diagram/${selectedId}/?payment=true`)
          }
          className="header-menu_item font-medium"
        >
          <Image src={Payment} alt="" height={24} width={24} />
          Thanh toán
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          onClick={() => router.push(`/pos/diagram/${selectedId}`)}
          className="header-menu_item font-medium"
        >
          <Image src={ArrowsOutLineHorizontal} alt="" />
          Tách hóa đơn
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span
          onClick={() => router.push(`/pos/diagram/${selectedId}`)}
          className="header-menu_item font-medium"
        >
          <Image src={ArrowsInLineHorizontal} alt="" />
          Gộp hóa đơn
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span
          onClick={() => {
            setOpenCancelPositon(true);
          }}
          className="header-menu_item font-medium"
        >
          <Image src={FileX} alt="" />
          Hủy hóa đơn
        </span>
      ),
    },
  ];

  const closeInvoiceAction: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span
          onClick={() => setOpenVat(true)}
          className="header-menu_item font-medium"
        >
          <Image src={Reciept} alt="" height={24} width={24} />
          Xuất hóa đơn VAT
        </span>
      ),
    },
    // {
    //   key: "2",
    //   label: (
    //     <span
    //       onClick={() => setOpen(true)}
    //       className="header-menu_item text-[#E50000] font-medium"
    //     >
    //       <Image src={deleteIcon} alt="" height={24} width={24} />
    //       Xóa hóa đơn
    //     </span>
    //   ),
    // },
  ];

  const calculateTotalBill = (currentBill) => {
    if (!currentBill || !currentBill.currentBillItems) {
      return {
        subtotal: 0,
        discount: 0,
        tax: 0,
        voucher: 0,
        total: 0,
      };
    }

    const {
      currentBillItems,
      discountValue,
      discountPercent,
      taxValue,
      taxPercent,
      voucherValue,
      voucherPercent,
    } = currentBill;

    const subtotal = currentBillItems.reduce((total, item) => {
      const productTotal =
        item.variant.price * item.quantity +
        item.openSelects.reduce(
          (acc, group) => acc + group.selection.price * group.quantity,
          0
        );
      return total + productTotal;
    }, 0);

    const discount =
      discountValue ??
      (discountPercent ? (subtotal * discountPercent) / 100 : 0);
    const tax =
      taxValue ?? (taxPercent ? ((subtotal - discount) * taxPercent) / 100 : 0);
    const voucher =
      voucherValue ??
      (voucherPercent ? ((subtotal - discount) * voucherPercent) / 100 : 0);
    const total = subtotal - discount + tax - voucher;

    return { subtotal, discount, tax, voucher, total };
  };

  const handleCancel = () => {
    setOpen2(false);
    setSelectedRecord(null);
  };

  const handleRowClick2 = (record: any) => {
    setSelectedRecord(record);
    setOpen2(true);
  };

  const handleRowClick = (record: any) => {
    router.push(`/pos/diagram/${record.positionId}`);
  };

  const handleOpenCancelModal = () => {
    setOpenCancelPositon(true);
    setId(selectedRecord.currentBillId);
    setSelectedRecord(null);
  };

  // Current Bill
  const columns: ColumnsType<any> = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => <p>{formatTime(value)}</p>,
    },
    {
      title: "Mã tham chiếu",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (value: any, record: any) => (
        <div
          onClick={() => handleRowClick(record)}
          className="text-[#3355FF] cursor-pointer"
        >
          {value}
        </div>
      ),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (value: string) => {
        if (value === "TABLE") {
          return t("dineIn");
        }
        return value;
      },
    },
    {
      title: "Tên đơn/Khu vực",
      dataIndex: "positionCode",
      key: "orderArea",
      align: "center",
      render: (value: any, record: any) => (
        <>
          <div className="text-center">
            <h1>{value}</h1>
            <h2 className="text-[#666666] italic">{record.areaName}</h2>
          </div>
        </>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      key: "totalAmount",
      align: "center",
      render: (value: any, record: any) => {
        return <p>{value ? formatMoney(value) : "-"}</p>;
      },
    },
    {
      title: "Thu ngân",
      dataIndex: "employeeName",
      key: "employeeName",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: string) => {
        return <CustomTag title={"Chưa thanh toán"} color={"processing"} />;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{ items: openInvoiceAction }}
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{ width: "210px" }}
          onOpenChange={(open) => {
            if (open) {
              setSelectedId(record.positionId);
              setId(record?.id);
            } else {
              setSelectedId(null);
            }
          }}
        >
          <button type="button" aria-label="Open menu">
            <Image src={ThreeDot} alt="" className="mx-auto" />
          </button>
        </Dropdown>
      ),
    },
  ];

  // Paid Bill
  const columns2: ColumnsType<any> = [
    {
      title: t("paymentTime"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: any) => {
        return value ? formatTime(value) : "-";
      },
    },
    {
      title: t("referenceCode"),
      dataIndex: "code",
      key: "code",
      render: (text: string, record: any) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          onClick={() => handleRowClick2(record)}
        >
          {text}
        </button>
      ),
      align: "center",
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (value: string) => {
        if (value === "TABLE") {
          return t("dineIn");
        }
        return value;
      },
    },
    {
      title: t("orderNameOrArea"),
      dataIndex: "positionCode",
      key: "orderArea",
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
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
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
      title: t("totalAmount"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => (value ? formatMoney(value) : "-"),
      align: "center",
    },
    {
      title: t("cashier"),
      dataIndex: "employeeNameEnd",
      key: "employeeNameEnd",
      align: "center",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
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
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{ items: closeInvoiceAction }}
          trigger={["click"]}
          placement="bottomRight"
          overlayStyle={{ width: "210px" }}
          onOpenChange={(open) => {
            if (open) {
              setSelectedId(record.id);
            } else {
              setSelectedId(null);
            }
          }}
        >
          <button type="button" aria-label="Open menu">
            <Image src={ThreeDot} alt="" className="mx-auto" />
          </button>
        </Dropdown>
      ),
    },
  ];

  const columnData = activeTab === "current" ? columns : columns2;
  const isLoadingData = activeTab === "current" ? isLoading : isLoading2;

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setData(key);
  };

  return (
    <>
      <CustomTabs
        tabs={tabs}
        onChange={handleTabChange}
        activeKey={activeTab}
      />

      <CustomTable
        rowSelection={{
          type: "checkbox",
        }}
        loading={isLoadingData}
        dataSource={data?.content?.map((item: any) => ({
          ...item,
          key: item.id,
        }))}
        columns={columnData}
        scroll={{ x: 1200 }}
      />

      <div className="px-5">
        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) =>
            setFormFilter({ ...formFilter, limit: value, page: 1 })
          }
          total={data?.totalElements}
        />
      </div>

      <ModalCancelBill
        isOpen={openCancelPosition}
        onCancel={() => setOpenCancelPositon(false)}
        id={Id}
        setId={setId}
        type="BILL"
      />

      <ExportVatModal
        isOpen={openVat}
        onClose={() => setOpenVat(false)}
        Id={Id}
        setId={setId}
      />

      {selectedRecord && (
        <InvoicesModal
          open={open2}
          onClose={handleCancel}
          data={selectedRecord}
          openCancelModal={handleOpenCancelModal}
        />
      )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

import { Dropdown, message } from "antd";
import type { MenuProps } from "antd";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import CustomActionHeader from "@/components/CustomActionHeader";
import { formatMoney } from "@/helpers";
import { formatTime } from "@/utils";
import { CustomInput } from "@/components/CustomInput";
import DisplaySetting from "@/components/CustomDisplaySetting/DisplaySetting";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import down from "@/assets/whiteChervonDown.svg";
import Import from "@/assets/GrayFileArrowUp.svg";
import GrayPlus from "@/assets/GrayPlus.svg";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import searchIcon from "@/assets/searchIcon.svg";
import filterIcon from "@/assets/filter.svg";
import ArrowIcon from "@/assets/arrowIcon.svg";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCustomerList,
  importCustomer,
  exportCustomer,
} from "@/api/customer.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const initialOptions = [
  { label: "Tên khách hàng", checked: true, disabled: true, key: "2" },
  { label: "Điện thoại", checked: true, disabled: false, key: "3" },
  { label: "Tổng chi tiêu", checked: true, disabled: true, key: "9" },
  { label: "Ngày sinh", checked: false, disabled: false, key: "10" },
  { label: "Mã khách hàng", checked: true, disabled: true, key: "1" },
  { label: "Giới tính", checked: false, disabled: false, key: "11" },
  { label: "Ngày tham gia", checked: false, disabled: false, key: "12" },
  { label: "Điểm tích lũy", checked: true, disabled: false, key: "8" },
  { label: "Hóa đơn gần đây", checked: true, disabled: false, key: "6" },
  { label: "Địa chỉ", checked: false, disabled: false, key: "13" },
  { label: "Hóa đơn", checked: true, disabled: false, key: "7" },
  { label: "Công nợ", checked: false, disabled: false, key: "14" },
  { label: "Nhóm khách hàng", checked: true, disabled: false, key: "4" },
  { label: "Hạng thẻ", checked: true, disabled: false, key: "5" },
];

const menuItems = [
  {
    key: "title",
    label: (
      <span className="text-[#666] font-[500]">Hiển thị khách hàng theo:</span>
    ),
    type: "group",
  },
  {
    key: "1",
    label: "Tổng chi tiêu",
  },
  {
    key: "2",
    label: "Tổng hóa đơn",
  },
  {
    key: "3",
    label: "Giới tính",
  },
  {
    key: "4",
    label: "Trạng thái",
  },
  {
    key: "5",
    label: "Điểm tích lũy",
  },
  {
    key: "6",
    label: "Tỉnh/Thành phố",
  },
];

const CustomerList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId: branchId,
  });
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

  const { data, isLoading, refetch } = useQuery(["CUSTOMER", formFilter], () =>
    getCustomerList(formFilter)
  );

  const initialColumns: ColumnsType<any> = [
    {
      key: "1",
      title: t("customerCode"),
      dataIndex: "code",
      align: "center",
      render: (value: string, record: any) => (
        <div
          className="cursor-pointer text-[#1890ff]"
          // onClick={() => router.push(`/customers/list/${record.id}`)}
        >
          {value || "-"}
        </div>
      ),
    },
    {
      key: "2",
      title: t("customerName"),
      dataIndex: "name",
      align: "center",
    },
    {
      key: "3",
      title: t("phoneNumber"),
      dataIndex: "phone",
      align: "center",
    },
    {
      key: "4",
      title: t("customerGroup"),
      dataIndex: "group",
      align: "center",
    },
    {
      key: "5",
      title: t("cardRank"),
      dataIndex: "rank",
      align: "center",
    },
    {
      key: "6",
      title: t("lastBuy"),
      dataIndex: "lastBuy",
      align: "center",
      render: (value: any) => (value ? formatTime(value) : "-"),
    },
    {
      key: "7",
      title: t("invoices"),
      dataIndex: "invoices",
      align: "center",
      render: (value: any) => value || "-",
    },
    {
      key: "8",
      title: t("currentPoints"),
      dataIndex: "currentPoints",
      align: "center",
      render: (value: any) => value || "-",
    },
    {
      key: "9",
      title: t("totalExpenditure"),
      align: "center",
      dataIndex: "totalExpenditure",
      render: (value: number) =>
        value !== undefined ? formatMoney(value) : "-",
    },
    {
      key: "10",
      title: t("birthday"),
      dataIndex: "birthday",
      align: "center",
      render: (value: any) => (value ? formatTime(value) : "-"),
    },
    {
      key: "11",
      title: t("gender"),
      dataIndex: "gender",
      align: "center",
      render: (value: any) => {
        if (value === "MALE") return t("male");
        if (value === "FEMALE") return t("female");
        return "-";
      },
    },

    {
      key: "12",
      title: t("joinDate"),
      dataIndex: "joinDate",
      align: "center",
      render: (value: any) => (value ? formatTime(value) : "-"),
    },
    {
      key: "13",
      title: t("address"),
      dataIndex: "address",
      align: "center",
      render: (value: any) => value || "-",
    },
    {
      key: "14",
      title: t("debt"),
      dataIndex: "debt",
      align: "center",
      render: (value: any) => value || "-",
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

  const handleInputChange = (value) => {
    setFormFilter((prevFilter) => ({
      ...prevFilter,
      keyword: value,
    }));
  };

  const { mutate: exportMutation, isLoading: isExporting } = useMutation(
    () => exportCustomer(branchId),
    {
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleExport = () => {
    exportMutation();
  };

  const { mutate: importMutation, isLoading: isImporting } = useMutation(
    (file: File) => importCustomer(file, branchId),
    {
      onSuccess: () => {
        message.error("Thành công!");

        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message || "Có lỗi xảy ra");
      },
    }
  );

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      importMutation(file);
      e.target.value = "";
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href="/customers/list/add-customer/">
          <div className="p-2 flex gap-2 items-center">
            <Image src={GrayPlus} />
            <div className=" text-[#333333]">{t("addCustomer")}</div>
          </div>
        </Link>
      ),
    },
    {
      key: "divider",
      type: "divider",
      style: { borderColor: "#E5E5E5" },
    },
    {
      key: "2",
      label: (
        <div onClick={handleFileClick} className="p-2 flex gap-2 items-center">
          <Image src={Import} />
          <div className="text-[#333333]">{t("importList")}</div>
        </div>
      ),
    },
  ];

  const CustomBtn = () => {
    return (
      <>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            suffixIcon={
              <div className="mt-1">
                <Image src={down} />
              </div>
            }
            className={`${isSmallScreen ? "no-text" : ""}`}
          >
            {t("addCustomer")}
          </CustomButton>
        </Dropdown>
      </>
    );
  };

  return (
    <>
      <CustomActionHeader
        title="customerList"
        type="custom"
        CustomBtn={CustomBtn}
      />

      <div className="card mb-6">
        <div className=" mb-6 flex sm:justify-between 2xs:justify-normal 2xs:flex-col sm:flex-row gap-3">
          <div className="xs:max-w-[320px] md:max-w-[426px] grid grid-cols-7">
            <div className="col-span-3">
              <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
                <CustomInput
                  onChange={() => {}}
                  className="suffix-icon h-11 !rounded-tl-lg !rounded-bl-lg !rounded-r-none border-r-0"
                  placeholder={t("filterCustomer")}
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

          <div className="flex gap-3">
            <DisplaySetting options={options} onSave={handleSaveOptions} />
            <CustomButton
              type="download-btn"
              prefixIcon={<Image src={Download} />}
              onClick={handleExport}
            >
              {t("download")}
            </CustomButton>
            <CustomButton type="print-btn" prefixIcon={<Image src={Printer} />}>
              {t("printList")}
            </CustomButton>
          </div>
        </div>

        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={data?.data?.content}
          loading={isLoading}
          columns={columns}
          onRow={(record) => ({
            onClick: () => router.push(`/customers/list/${record.id}`),
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

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        aria-label="Upload File"
      />
    </>
  );
};

export default CustomerList;

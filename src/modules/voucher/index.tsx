import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import CustomTag from "@/components/CustomTag";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { getVouchers } from "@/api/voucher.service";
import CustomActionHeader from "@/components/CustomActionHeader";
import { Dropdown, Menu, MenuProps, Space } from "antd";
import { CustomInput } from "@/components/CustomInput";
import _debounce from "lodash/debounce";
import SearchIcon from "@/assets/searchIcon.svg";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import { useRouter } from "next/router";
import { formatDate, formatMoney } from "@/helpers";
import useWindowSize from "@/hooks/useWindowSize";

const voucherTypeGroup = [
  { value: "PERCENT", name: "Theo phần trăm" },
  { value: "AMOUNT", name: "Theo số tiền" },
  { value: "FIXEDPRICE", name: "Đồng giá" },
  { value: "FREEITEM", name: "Tặng món" },
];

interface VoucherRecord {
  key: number;
  title: string;
  voucher: string;
  voucherType: string;
  saleChanel: string;
  start: string;
  end: string;
  status: string;
}

const Voucher = () => {
  const { t } = useTranslation();
  const isSmallScreen = useWindowSize();
  const branch = useRecoilValue(branchStateSession);
  const router = useRouter();
  const [currentFilterType, setCurrentFilterType] = useState<string>("");
  const [currentFilterApplyType, setCurrentFilterApplyType] =
    useState<string>("");

  const [formFilter, setFormFilter] = useState({
    limit: 10,
    page: 1,
    sort: "",
    branchId: branch?.id,
    voucherType: "",
  });

  const { data: vouchers, isLoading } = useQuery(["VOUCHER", formFilter], () =>
    getVouchers(formFilter)
  );

  const columns: ColumnsType<VoucherRecord> = [
    {
      title: "",
      dataIndex: "",
      key: "",
      align: "center",
    },
    {
      title: t("salePromotion"),
      dataIndex: "name",
      align: "start",
      key: "name",
      render: (_, record: any) => (
        <div>
          <Link href={`/vouchers/add-voucher/?id=${record?.key}`}>
            <h1
              className="text-[#3355FF] cursor-pointer max-w-[300px]  font-[500] block text-line-1"
              title={record?.name}
            >
              {record?.name}
            </h1>
          </Link>

          {record?.type === "AMOUNT" && (
            <span>
              Giảm giá {formatMoney(record?.discountValue)} cho{" "}
              {record?.applyType === "ORDER"
                ? "hóa đơn"
                : record?.applyType === "CATEGORY"
                ? "danh mục"
                : record?.applyType === "ITEM"
                ? "sản phẩm"
                : ""}
            </span>
          )}

          {record?.type === "PERCENT" && (
            <span>
              Giảm giá {record?.discountValue}% cho{" "}
              {record?.applyType === "ORDER"
                ? "hóa đơn"
                : record?.applyType === "CATEGORY"
                ? "danh mục"
                : record?.applyType === "ITEM"
                ? "sản phẩm"
                : ""}
            </span>
          )}

          {record?.type === "FIXEDPRICE" && (
            <span>
              Đồng giá {formatMoney(record?.discountValue)} cho{" "}
              {record?.applyType === "ORDER"
                ? "hóa đơn"
                : record?.applyType === "CATEGORY"
                ? "danh mục"
                : record?.applyType === "ITEM"
                ? "sản phẩm"
                : ""}
            </span>
          )}

          {record?.type === "FREEITEM" && (
            <span>
              Tặng món theo{" "}
              {record?.applyType === "ORDER"
                ? "hóa đơn"
                : record?.applyType === "CATEGORY"
                ? "danh mục"
                : record?.applyType === "ITEM"
                ? "sản phẩm"
                : ""}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("voucherType"),
      dataIndex: "type",
      key: "type",
      align: "start",
      render: (value: string) => {
        const voucherType = voucherTypeGroup.find(
          (item) => item.value === value
        );
        return voucherType ? voucherType.name : value;
      },
    },
    {
      title: t("salesChannel"),
      dataIndex: "isOnlineChannel",
      key: "isOnlineChannel",
      align: "center",
      render: (value: boolean, record: any) => {
        if (value) {
          const menuItems: MenuProps["items"] = [
            {
              key: "online",
              label: <span>Bán hàng online</span>,
            },
            {
              key: "offline",
              label: <span>Bán tại nhà hàng</span>,
            },
          ];

          return (
            <Dropdown
              overlay={<Menu items={menuItems} />}
              trigger={["hover"]}
              placement="bottomCenter"
            >
              <div className="cursor-pointer flex items-center justify-center gap-2">
                <span>2 kênh</span>
                <Image src={DropIcon} alt="Dropdown icon" />
              </div>
            </Dropdown>
          );
        }
        return "Bán tại nhà hàng";
      },
    },
    {
      title: t("start"),
      dataIndex: "startDay",
      key: "startDay",
      align: "center",
      render: (value) => (value ? formatDate(value) : null),
    },
    {
      title: t("end"),
      dataIndex: "endDay",
      key: "endDay",
      align: "center",
      render: (value) => (value ? formatDate(value) : "--/--"),
    },
    {
      title: t("status"),
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (value: boolean) => {
        const color = value ? "success" : "error";
        const title = value ? t("active") : t("inactive");
        return <CustomTag color={color} title={title} />;
      },
    },
  ];

  const handleFilterType = (filterType: string, label: string) => {
    setFormFilter((prev) => ({
      ...prev,
      voucherType: filterType,
    }));
    setCurrentFilterType(label);
  };

  const handleFilterApplyType = (filterType: string, label: string) => {
    setFormFilter((prev) => ({
      ...prev,
      applyType: filterType,
    }));
    setCurrentFilterApplyType(label);
  };

  const typeItems: MenuProps["items"] = [
    {
      key: "",
      label: <span onClick={() => handleFilterType("", "Tất cả")}>Tất cả</span>,
    },
    {
      key: "PERCENT",
      label: (
        <span onClick={() => handleFilterType("PERCENT", "Theo phần trăm")}>
          Theo phần trăm
        </span>
      ),
    },
    {
      key: "AMOUNT",
      label: (
        <span onClick={() => handleFilterType("AMOUNT", "Theo số tiền")}>
          Theo số tiền
        </span>
      ),
    },
    {
      key: "FIXEDPRICE",
      label: (
        <span onClick={() => handleFilterType("FIXEDPRICE", "Đồng giá")}>
          Đồng giá
        </span>
      ),
    },
    {
      key: "FREEITEM",
      label: (
        <span onClick={() => handleFilterType("FREEITEM", "Tặng món")}>
          Tặng món
        </span>
      ),
    },
  ];

  const appyTypeItems: MenuProps["items"] = [
    {
      key: "",
      label: (
        <span onClick={() => handleFilterApplyType("", "Tất cả")}>Tất cả</span>
      ),
    },
    {
      key: "ORDER",
      label: (
        <span onClick={() => handleFilterApplyType("ORDER", "Đơn hàng")}>
          Hóa đơn
        </span>
      ),
    },
    {
      key: "CATEGORY",
      label: (
        <span onClick={() => handleFilterApplyType("CATEGORY", "Danh mục")}>
          Danh mục
        </span>
      ),
    },
    {
      key: "ITEM",
      label: (
        <span onClick={() => handleFilterApplyType("ITEM", "Sản phẩm")}>
          Sản phẩm
        </span>
      ),
    },
  ];

  const CustomBtn = () => {
    return (
      <CustomButton
        type="primary"
        wrapClassName="mx-2"
        prefixIcon={<Image src={PlusIcon} />}
        className={`${isSmallScreen ? "no-text" : ""}`}
        onClick={() => router.push("/vouchers/add-voucher")}
      >
        Thêm giảm giá
      </CustomButton>
    );
  };

  return (
    <>
      <CustomActionHeader
        title="Thẻ giảm giá"
        type="custom"
        CustomBtn={CustomBtn}
      />

      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between pb-[10px] mb-[15px]">
          <div className="flex items-center">
            <Space.Compact block className="">
              <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
                <Dropdown menu={{ items: typeItems }}>
                  <Space>
                    <div className="flex items-center w-[180px] justify-between border-r-2 pr-2">
                      <div className="flex items-center">
                        <Image src={FilterIcon} />
                        <span className="mx-2 cursor-pointer">
                          {currentFilterType || "Loại giảm giá"}
                        </span>
                      </div>
                      <Image src={DropIcon} />
                    </div>
                  </Space>
                </Dropdown>

                <Dropdown menu={{ items: appyTypeItems }}>
                  <Space>
                    <div className="flex items-center w-[150px] justify-between">
                      <div className="flex items-center">
                        <span className=" mx-2 cursor-pointer">
                          {currentFilterApplyType || "Áp dụng"}
                        </span>
                      </div>
                      <Image src={DropIcon} />
                    </div>
                  </Space>
                </Dropdown>
              </div>
              <CustomInput
                placeholder="Tìm kiếm "
                prefixIcon={<Image src={SearchIcon} alt="" />}
                wrapClassName="w-full"
                className="w-full lg:w-[264px] h-[36px]"
                onChange={_debounce((value) => {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    keyword: value,
                  }));
                }, 300)}
              />
            </Space.Compact>
          </div>

          <div className="flex gap-[10px]">
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
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={vouchers?.data?.content?.map((item: any, index) => ({
            ...item,
            key: item.id,
          }))}
          columns={columns}
          loading={isLoading}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          total={vouchers?.data?.totalElements}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        />
      </div>
    </>
  );
};

export default Voucher;

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Dropdown, MenuProps, message, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import EditIcon from "@/assets/Pencil.svg";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import down from "@/assets/whiteChervonDown.svg";
import GrayPlus from "@/assets/GrayPlus.svg";
import Import from "@/assets/GrayFileArrowUp.svg";
import DeleIcon from "@/assets/deleteRed.svg";

import AddView from "./components/AddView";
import CustomTable from "@/components/CustomTable";
import CustomPagination from "@/components/CustomPagination";
import { CustomSwitch } from "@/components/CustomSwitch";
import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteManyProduct,
  exportProduct,
  getProducts,
  updateStatusProduct,
} from "@/api/product.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchStateSession, selectedColumnsState } from "@/recoil/state";
import _debounce from "lodash/debounce";
import useWindowSize from "@/hooks/useWindowSize";

const defaultVisibleColumns = [
  "avatarUrl",
  "name",
  "channel",
  "variants",
  "variantss",
  "status",
];

const ProductList = () => {
  const { t } = useTranslation();
  const isSmallScreen = useWindowSize();
  const router = useRouter();
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);
  const branchId = branch?.id;
  const [isOpenView, setIsOpenView] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedColumns, setSelectedColumns] =
    useRecoilState(selectedColumnsState);
  const [currentFilterType, setCurrentFilterType] = useState<string>("");
  const [currentFilterStatus, setCurrentFilterStatus] = useState<string>("");

  const handleSaveColumns = (newColumns: string[]) => {
    setSelectedColumns(newColumns);
  };

  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedColumns(defaultVisibleColumns);
    }
  }, [selectedColumns, setSelectedColumns]);

  const mutation = useMutation({
    mutationFn: (ids: number[] | any) => deleteManyProduct(ids, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries(["PRODUCT"]);
      message.success("Xóa thành công!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleDelete = () => {
    mutation.mutate(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const [formFilter, setFormFilter] = useState({
    limit: 10,
    page: 1,
    sort: "",
    keyword: "",
    branchId: branch?.id,
    categoryId: "",
    type: "",
    isProduct: true,
  });

  const { data: products, isLoading } = useQuery(["PRODUCT", formFilter], () =>
    getProducts(formFilter)
  );

  const { mutate: exportMutation, isLoading: isExporting } = useMutation(
    () => exportProduct(branchId),
    {
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleExport = () => {
    exportMutation();
  };

  const columns: ColumnsType<any> = [
    {
      title: (
        <div className="flex w-[30px] items-center flex-nowrap justify-start">
          {selectedRowKeys?.length > 0 && (
            <div
              className="left-4 bottom-2 cursor-pointer"
              onClick={handleDelete}
            >
              <Image src={DeleIcon} />
            </div>
          )}
        </div>
      ),
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      align: "start",
      render: (avatarUrl: string | null, record: any) => {
        if (!avatarUrl) {
          return (
            <div className="w-[60px] h-[60px] rounded-md flex items-center justify-start text-gray-400 text-xs"></div>
          );
        } else if (avatarUrl.startsWith("#")) {
          return (
            <div
              className="w-[60px] h-[60px] rounded-md"
              style={{ backgroundColor: avatarUrl }}
              onClick={() => {
                router.push(`/products/list/add-product/?id=${record.id}`);
              }}
            />
          );
        } else {
          return (
            <Image
              src={avatarUrl}
              alt="Product Image"
              width={60}
              height={60}
              onClick={() => {
                router.push(`/products/list/add-product/?id=${record.id}`);
              }}
            />
          );
        }
      },
    },
    {
      title: "Tên mặt hàng",
      dataIndex: "name",
      key: "name",
      align: "start",
      render: (_, record: any) => (
        <div>
          <Link href={`/products/list/add-product/?id=${record.id}`}>
            <h1
              className="text-[#3355FF] cursor-pointer max-w-[350px] font-[500] block text-line-1"
              title={record?.name}
            >
              {record?.name}
            </h1>
          </Link>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (value: string | any, record) => (
        <span className="text-line-1">{value?.name}</span>
      ),
    },
    {
      title: "Kênh bán hàng",
      dataIndex: "channel",
      key: "channel",
    },
    {
      title: "Bar/Bếp",
      dataIndex: "bar",
      key: "bar",
    },
    {
      title: "Giá bán",
      dataIndex: "variants",
      key: "variants",
      render: (variants: any[] | null) => {
        if (!variants || variants?.length === 0) {
          return <span>Không có giá</span>;
        }

        if (variants.length === 1) {
          return <span>{variants[0]?.price?.toLocaleString()} đ</span>;
        }
        return <span>{variants?.length} giá</span>;
      },
    },
    {
      title: "Giá vốn",
      dataIndex: "variants",
      key: "variantss",
      render: (variants: any[] | null) => {
        if (!variants || variants.length === 0) {
          return <span>Không có giá</span>;
        }

        if (variants.length === 1) {
          return <span>{variants[0]?.primePrice?.toLocaleString()} đ</span>;
        }
        return <span>{variants.length} giá</span>;
      },
    },
    {
      title: "Cho phép bán hàng",
      dataIndex: "status",
      key: "status",
      align: "end",
      render: (value: string, record: any) => (
        <CustomSwitch
          defaultChecked={value === "ACTIVE"}
          onChange={() => {
            const newStatus = value === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            updateStatusProduct(record?.id, {
              branchId: record?.branchId,
              status: newStatus,
            })
              .then(() => {
                message.success("Cập nhật trạng thái thành công");
                queryClient.invalidateQueries(["PRODUCT"]);
              })
              .catch((error) => {
                message.error("Cập nhật trạng thái thất bại");
              });
          }}
        />
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (col: any) =>
      selectedColumns.includes(col.key) ||
      ["name", "channel", "variants"].includes(col.key)
  );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href="/products/list/add-product">
          <div className="p-2 flex gap-2 items-center">
            <Image src={GrayPlus} />
            <div className=" text-[#333333]">Thêm mặt hàng</div>
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
        <div className="p-2 flex gap-2 items-center">
          <Image src={Import} />
          <div className="text-[#333333]">{t("importList")}</div>
        </div>
      ),
    },
  ];

  const handleFilterType = (filterType: string, label: string) => {
    setFormFilter((prev) => ({
      ...prev,
      type: filterType,
      isProduct: filterType === "COMBO" ? false : prev.isProduct,
    }));
    setCurrentFilterType(label);
  };

  const handleFilterStatus = (filterStatus: string, label: string) => {
    setFormFilter((prev) => ({
      ...prev,
      status: filterStatus,
    }));
    setCurrentFilterStatus(label);
  };

  const typeItems: MenuProps["items"] = [
    {
      key: "",
      label: <span onClick={() => handleFilterType("", "Tất cả")}>Tất cả</span>,
    },
    {
      key: "QUANTITY",
      label: (
        <span onClick={() => handleFilterType("QUANTITY", "Theo số lượng")}>
          Theo số lượng
        </span>
      ),
    },
    {
      key: "WEIGHT",
      label: (
        <span onClick={() => handleFilterType("WEIGHT", "Theo trọng lượng")}>
          Theo trọng lượng
        </span>
      ),
    },
    {
      key: "TIME",
      label: (
        <span onClick={() => handleFilterType("TIME", "Theo thời gian")}>
          Theo thời gian
        </span>
      ),
    },
  ];

  const statusItems: MenuProps["items"] = [
    {
      key: "",
      label: (
        <span onClick={() => handleFilterStatus("", "Tất cả")}>Tất cả</span>
      ),
    },
    {
      key: "ACTIVE",
      label: (
        <span onClick={() => handleFilterStatus("ACTIVE", "Đang hoạt động")}>
          Đang hoạt động
        </span>
      ),
    },
    {
      key: "INACTIVE",
      label: (
        <span onClick={() => handleFilterStatus("INACTIVE", "Ngưng hoạt động")}>
          Ngưng hoạt động
        </span>
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
            Thêm mới mặt hàng
          </CustomButton>
        </Dropdown>
      </>
    );
  };

  return (
    <>
      <CustomActionHeader
        title="Danh sách mặt hàng"
        type="custom"
        CustomBtn={CustomBtn}
      />

      <div className="card mb-6">
        {/* Header */}
        <div className="flex justify-between gap-[20px] flex-wrap pb-[10px] mb-[15px]">
          <div className="flex items-center">
            <Space.Compact block>
              <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
                <Dropdown menu={{ items: typeItems }}>
                  <Space>
                    <div className="flex items-center w-[200px] border-r-2 pr-2 justify-between">
                      <div className="flex items-center">
                        <Image src={FilterIcon} />
                        <span className="mx-2 cursor-pointer">
                          {currentFilterType || "Loại mặt hàng"}
                        </span>
                      </div>
                      <Image src={DropIcon} />
                    </div>
                  </Space>
                </Dropdown>
                <Dropdown menu={{ items: statusItems }}>
                  <Space>
                    <div className="flex items-center w-[170px] justify-between">
                      <div className="flex items-center">
                        <span className=" mx-2 cursor-pointer">
                          {currentFilterStatus || "Trạng thái"}
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
                className="w-[264px] h-[36px]"
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
              type="outline"
              className="!rounded-[50px]"
              prefixIcon={<Image src={EditIcon} />}
              onClick={() => setIsOpenView(true)}
            >
              Tùy chỉnh hiển thị
            </CustomButton>

            <CustomButton
              type="download-btn"
              prefixIcon={<Image src={Download} />}
              disabled={isExporting}
              onClick={handleExport}
            >
              {t("download")}
            </CustomButton>

            <CustomButton type="print-btn" prefixIcon={<Image src={Printer} />}>
              {t("printList")}
            </CustomButton>
          </div>
        </div>
        {/* -------- */}
        <CustomTable
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: number[] | any) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          dataSource={products?.data?.content?.map((item: any, index) => ({
            ...item,
            key: item.id,
            status: item.status,
            bar: item?.bar?.name,
          }))}
          loading={isLoading}
          columns={filteredColumns}
          rowClassName={() => "hover-row"}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          total={products?.data?.totalElements}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        />
      </div>

      <AddView
        isOpen={isOpenView}
        onCancel={() => setIsOpenView(false)}
        selectedColumns={selectedColumns}
        onSave={handleSaveColumns}
      />
    </>
  );
};

export default ProductList;

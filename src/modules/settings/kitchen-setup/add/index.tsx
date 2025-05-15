import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import CustomTable from "@/components/CustomTable";
import { ColumnType } from "antd/es/table";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";
import Search from "../Search";
import { CustomButton } from "@/components/CustomButton";
import { Dropdown, MenuProps } from "antd";
import MoveModal from "./MoveModal/AddModal";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import NotFound from "@/assets/Product_Empty.svg";
import Close from "@/assets/X.svg";
import SortIcon from "@/assets/column-sorting.svg";
import down from "@/assets/arrowDownBlack.svg";

import { formatMoney } from "@/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { message } from "antd";
import schema from "./schema";

import { useMutation } from "@tanstack/react-query";
import { createBar } from "@/api/kitchen.service";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import AddModal from "./AddModal/AddModal";
import { isColorAvatar } from "@/utils";
import { CustomCheckbox } from "@/components/CustomCheckbox";

const AddKitchen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [product, setProduct] = useState<any>([]);
  const productId = product.length > 0 ? product.map((item) => item.id) : [];
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<any[]>([]);

  const {
    getValues,
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    // defaultValues: {
    //   name: "",
    //   isDefault: true,
    // },
  });

  const { mutate: createCustomerMutation, isLoading } = useMutation(
    (data: any) => createBar(data),
    {
      onSuccess: () => {
        message.success("Thêm bếp thành công!");
        router.push("/settings/kitchen-setup");
        reset();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    const data = getValues();

    const submittedData = {
      ...data,
      branchId,
      productIds: productId,
    };

    createCustomerMutation(submittedData);
  };

  const locale = {
    emptyText: (
      <div className="text-center my-12">
        <Image src={NotFound} alt="No Data" />
        <p className="text-gray-800 font-semibold mt-5 text-xl">
          Chưa có mặt hàng nào được kết nối tới bar/bếp
        </p>
        <p className="text-[#666666]">
          Kết nối mặt hàng tới bar / bếp để quản lý in đơn hàng theo từng bar /
          bếp riêng biệt
        </p>
      </div>
    ),
  };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedProductIds(selectedRowKeys as string[]);
  };

  const handleRemoveSelected = () => {
    setProduct((prevProduct) =>
      prevProduct.filter((item) => !selectedProductIds.includes(item.id))
    );
    setSelectedProductIds([]);
  };

  const handleRemove = (id) => {
    setProduct(product.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (!searchKeyword) {
      setFilteredProduct(product);
    } else {
      const result = product.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredProduct(result);
    }
  }, [searchKeyword, product]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div onClick={() => setOpen2(true)} className="p-2 items-center">
          <div className="text-[#333333] text-[14px]">Chuyển bar/bếp khác</div>
        </div>
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
        <div onClick={handleRemoveSelected} className="p-2 items-center">
          <div className="text-[#333333] text-[14px]">Xóa khỏi bar/bếp</div>
        </div>
      ),
    },
  ];

  const columns: ColumnType<any>[] = [
    {
      title: (
        <div className="flex justify-start items-center -ml-5">
          {selectedProductIds.length > 0 ? (
            <span className="text-[#333333] text-[14px]">
              Đã chọn {selectedProductIds.length} mặt hàng
            </span>
          ) : (
            <Image src={SortIcon} className="w-5 h-5" />
          )}
        </div>
      ),
      dataIndex: "index",
      width: 60,
      render: (_, __, index: number) => (
        <span className="text-[#333333] font-semibold">{index + 1}</span>
      ),
      align: "center",
      onHeaderCell: () => ({
        colSpan: selectedProductIds.length > 0 ? 2 : 1,
      }),
    },
    {
      title:
        selectedProductIds?.length > 0 ? (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomLeft"
            arrow
            overlayStyle={{ minWidth: "auto" }}
            className="dropdown-2"
          >
            <CustomButton
              type="primary"
              wrapClassName="mx-2 !h-9"
              className="basic"
              suffixIcon={
                <div className="mt-1">
                  <Image src={down} />
                </div>
              }
            >
              Chọn thao tác
            </CustomButton>
          </Dropdown>
        ) : (
          <div className="flex justify-start items-center">
            {product?.length} mặt hàng
          </div>
        ),

      dataIndex: "avatarUrl",
      align: "center",
      width: "120px",
      render: (value) => {
        if (!value) return null;

        if (isColorAvatar(value)) {
          return (
            <div
              className={` h-[60px] w-[60px] mx-auto rounded-md`}
              style={{ backgroundColor: value }}
            ></div>
          );
        } else {
          return (
            <Image
              src={value}
              alt="Avatar"
              className="h-[60px] w-[60px] rounded-md"
              width={60}
              height={60}
            />
          );
        }
      },
    },
    {
      dataIndex: "name",
      render: (value: string) => (
        <span className="cursor-pointer text-[#1890ff]">{value}</span>
      ),
    },
    // {
    //   title: "",
    //   dataIndex: "name",
    //   render: (value: string, record: any) => {
    //     const productName = record?.product?.name;
    //     const variantName = value;

    //     if (variantName !== productName) {
    //       return (
    //         <span className="cursor-pointer text-[#1890ff]">
    //           {productName} ({variantName})
    //         </span>
    //       );
    //     }

    //     return (
    //       <span className="cursor-pointer text-[#1890ff]">{productName}</span>
    //     );
    //   },
    // },
    {
      dataIndex: "price",
      align: "right",
      render: (_, record) => {
        const variantCount = record.variants.length;

        return variantCount === 1 ? (
          <span>{formatMoney(record.variants[0].price)}</span>
        ) : (
          <span>{variantCount} giá</span>
        );
      },
    },
    {
      align: "right",
      width: 70,
      onCell: (_) => ({
        colSpan: selectedProductIds.length > 0 ? 2 : 1,
      }),
      render: (record) => (
        <div onClick={() => handleRemove(record?.id)}>
          <Image src={Close} alt="Close Icon" width={24} height={24} />
        </div>
      ),
    },
  ];

  const handleProductSelection = (pro) => {
    setProduct((prevSelectedProducts) => [...prevSelectedProducts, ...pro]);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <>
      <div className="px-8 mb-6">
        <CustomActionHeader
          title="addNewBar"
          type="save"
          onSubmit={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />

        <div className="card flex flex-col gap-4">
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-1 md:col-span-2">
                  <Label infoText="" label={t("kitchenName")} required />
                  <CustomInput
                    className={`suffix-icon h-11 !rounded`}
                    placeholder="Nhập tên bếp"
                    onChange={onChange}
                    value={value ?? ""}
                  />
                  <InputError error={errors.name?.message} />
                </div>
              )}
            />
          </div>

          <Controller
            name="isDefault"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex gap-2 items-center">
                <CustomCheckbox checked={value ?? false} onChange={onChange} />{" "}
                <div className="text-[#333333] text-[14px]">
                  Đặt làm bếp mặc định
                </div>
              </div>
            )}
          />

          <div className="w-full h-px bg-[#E5E5E5]"></div>

          <div>
            <div className="mb-4">
              <Search onSearch={handleSearch} onClick={() => setOpen(true)} />
            </div>

            <CustomTable
              rowSelection={{
                type: "checkbox",
                onChange: handleRowSelectionChange,
              }}
              dataSource={filteredProduct}
              columns={columns}
              locale={locale}
              showHeader={product?.length > 0}
              scroll={{ x: 500 }}
              rowClassName={() => "hover-row"}
              rowKey={"id"}
            />
          </div>
        </div>
      </div>

      <AddModal
        isOpen={open}
        branchId={branchId}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
        onSelection={handleProductSelection}
        Ids={productId}
        onRemove={handleRemove}
      />

      <MoveModal
        isOpen={open2}
        branchId={branchId}
        onCancel={() => setOpen2(false)}
        Ids={selectedProductIds}
        onRemove={handleRemoveSelected}
      />
    </>
  );
};

export default AddKitchen;

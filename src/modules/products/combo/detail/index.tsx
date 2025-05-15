import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Divider } from "antd";
import CustomActionHeader from "@/components/CustomActionHeader";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomTable from "@/components/CustomTable";
import CustomColorPicker from "@/components/CustomColorPicker";
import CustomUpload2 from "@/modules/account-setup/Upload";
import { CustomRadio } from "@/components/CustomRadio";
import AddModal from "./AddModal";
import Search from "./Search";
import { isColorAvatar } from "@/utils";
import { formatMoney } from "@/helpers";
import { ColumnType } from "antd/es/table";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";

import PlusIcon from "@/assets/plusOrangeIcon.svg";
import NotFound from "@/assets/Product_Empty.svg";
import Close from "@/assets/X.svg";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import schema from "./schema";
import InputError from "@/components/InputError";
import { updateCombo, getDetailCombo, deleteCombo } from "@/api/combo.service";
import { getMenu } from "@/api/menu.service";
import { getCategory } from "@/api/category.service";
import { getBar } from "@/api/kitchen.service";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const radioOptions = [
  { value: "1", label: "Bán hàng tại nhà" },
  { value: "2", label: "GrabFood" },
  { value: "3", label: "ShopeeFood" },
];

const groupProduct = {
  data: {
    items: [
      { id: "", name: "-- Chọn loại mặt hàng --" },
      { id: "1", name: "Tính tiền theo số lượng" },
      { id: "2", name: "Tính tiền theo trọng lượng " },
      { id: "3", name: "Tính tiền theo thời gian" },
    ],
  },
};

const DetailCombo = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const [product, setProduct] = useState<any>([]);
  const [productIds, setProductIds] = useState<any>([]);
  const productId = product.length > 0 ? product.map((item) => item.id) : [];
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState<any>([]);
  const [categoryId, setCategoryId] = useState<any>([]);
  const [avatarOption, setAvatarOption] = useState("picture");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const [menuFilter, setMenuFilter] = useState({
    branchId: branchId,
  });

  const [barFilter, setBarFilter] = useState({
    branchId: branch?.id,
    keyword: "",
  });

  const { data, isLoading, refetch } = useQuery(["DETAIL"], () =>
    getDetailCombo(id, branchId)
  );

  const { data: menu, isLoading: isLoadingMenu } = useQuery(
    ["MENU", menuFilter],
    () => getMenu(menuFilter)
  );

  // const { data: category, isLoading: isLoadingCategory } = useQuery(
  //   ["CATEGORY", menuFilter],
  //   () => getCategory(menuFilter)
  // );

  const { data: bar, isLoading: isLoadingBar } = useQuery(
    ["BAR", barFilter],
    () => getBar(barFilter)
  );

  const comboDetail = data?.data;

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
    defaultValues: {
      name: comboDetail?.name || "",
      price: comboDetail?.price || "",
      avatarUrl: comboDetail?.avatarUrl || "",
      isFixPrice: comboDetail?.isFixPrice || false,
      code: comboDetail?.code || "",
      variants: comboDetail?.comboVariants || [],
      quantity: comboDetail?.quantity || 1,
      menus: comboDetail?.menus || null,
      categoryId: comboDetail?.categoryId || null,
      barId: comboDetail?.bar?.id || null,
    },
  });

  useEffect(() => {
    if (comboDetail && comboDetail.menus) {
      reset({
        name: comboDetail?.name,
        price: comboDetail?.price,
        avatarUrl: comboDetail?.avatarUrl,
        isFixPrice: comboDetail?.isFixPrice,
        code: comboDetail?.code,
        variants: comboDetail?.comboVariants,
        quantity: comboDetail?.quantity,
        menus: comboDetail?.menus,
        categoryId: comboDetail?.categoryId,
        barId: comboDetail?.bar?.id,
      });

      const variants = comboDetail.comboVariants.map((combo) => ({
        ...combo.variant,
        quantity: combo.quantity,
      }));

      setProduct(variants);

      const color = getValues("avatarUrl");
      if (isColorAvatar(color)) {
        setAvatarOption("color");
      }

      const menus = getValues("menus");
      const menuIds = menus ? menus.map((menu) => menu.id) : [];
      setMenuId(menuIds);
      setValue("menus", menuIds);
    }
  }, [comboDetail, reset]);

  const { mutate: updateMutation, isLoading: isUpdating } = useMutation(
    (data: any) => updateCombo(data, id),
    {
      onSuccess: () => {
        message.success("Cập nhật thành công!");
        router.push("/products/combo");
        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    if (product.length === 0) {
      message.warning("Danh sách mặt hàng không được để trống!");
      return;
    }

    const data = getValues();

    const variants = product.map((item) => ({
      variantId: item.id,
      quantity: item.quantity,
    }));

    const submittedData = {
      ...data,
      branchId,
      variants,
      menuIds: getValues("menus"),
    };

    updateMutation(submittedData);
  };

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation(
    () => deleteCombo(branchId, id),
    {
      onSuccess: () => {
        message.success("Xóa combo thành công!");
        router.push("/products/combo");
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onDelete = () => {
    deleteMutation();
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
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

  const locale = {
    emptyText: (
      <div className="text-center my-12">
        <Image src={NotFound} alt="No Data" />
        <p className="text-gray-800 font-semibold mt-5 text-xl">
          Không có mặt hàng nào trong danh mục này
        </p>

        <div className="mx-auto">
          <CustomButton
            type="outline"
            className="!rounded-[50px]"
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => setOpen(true)}
          >
            {t("addProduct")}
          </CustomButton>
        </div>
      </div>
    ),
  };

  const handleRemove = (id) => {
    setProduct(product.filter((item) => item.id !== id));
  };

  const updateProductIds = (data: any) => {
    const updatedProductIds = data.map((item) => {
      const productId = item.product.id;
      const variantId = item.id;

      return [productId, `${productId}-${variantId}`];
    });

    setProductIds(updatedProductIds.flat());
  };

  const calculateTotalPrice = () => {
    return product.reduce((total, record) => {
      const price = record?.price;
      const quantity = record.quantity || 1;
      return total + quantity * price;
    }, 0);
  };

  useEffect(() => {
    updateProductIds(product);
    setTotalAmount(calculateTotalPrice());
  }, [product]);

  const handleQuantityChange = (recordId, newQuantity) => {
    const updatedProducts = product.map((item) => {
      if (item.id === recordId) {
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });

    setProduct(updatedProducts);
  };

  const columns: ColumnType<any>[] = [
    {
      title: t("index"),
      dataIndex: "index",
      width: 60,
      render: (_, __, index: number) => (
        <span className="text-[#333333] font-semibold">{index + 1}</span>
      ),
      align: "center",
    },
    {
      title: t("image"),
      dataIndex: "product",
      align: "center",
      render: (value) => {
        const avatar = value?.avatarUrl;

        if (!avatar) return null;

        if (isColorAvatar(avatar)) {
          return (
            <div
              className={` h-[60px] w-[60px] mx-auto rounded-md`}
              style={{ backgroundColor: avatar }}
            ></div>
          );
        } else {
          return (
            <Image
              src={avatar}
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
      title: t("productName"),
      dataIndex: "name",
      render: (value: string, record: any) => {
        const productName = record?.product?.name;
        const variantName = value;

        if (variantName !== productName) {
          return (
            <span className="cursor-pointer text-[#1890ff]">
              {productName} ({variantName})
            </span>
          );
        }

        return (
          <span className="cursor-pointer text-[#1890ff]">{productName}</span>
        );
      },
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      align: "center",
      render: (value: any, record: any) => (
        <CustomInput
          min={1}
          type="number"
          onChange={(value) => handleQuantityChange(record.id, Number(value))}
          className="w-[108px]  mx-auto"
          value={value || 1}
        />
      ),
    },
    {
      title: t("retailPrice"),
      dataIndex: "price",
      align: "right",
      render: (value) => {
        return <span>{formatMoney(value)}</span>;
      },
    },
    {
      title: t("totalPrice"),
      dataIndex: "totalPrice",
      align: "right",
      render: (_, record: any) => {
        const quantity = record.quantity || 1;
        const totalPrice = quantity * record?.price;
        return <span>{formatMoney(totalPrice)}</span>;
      },
    },
    {
      align: "right",
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

  return (
    <>
      <CustomActionHeader
        title={comboDetail?.name}
        type="delete"
        onDelete={() =>
          setShowDeleteNoti({
            visible: true,
            content: `Xóa ${comboDetail.name}`,
          })
        }
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />

      <div className="grid 2xs:grid-cols-1 md:grid-cols-3 2xs:gap-4 lg:gap-6 mb-6">
        <div className="2xs:gap-4 lg:gap-6 flex flex-col 2xs:col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 card gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="col-span-1 md:col-span-2">
                  <Label infoText="" label={t("comboName")} required />
                  <CustomInput
                    className={`suffix-icon h-11 !rounded`}
                    placeholder="Nhập tên combo"
                    onChange={onChange}
                    value={value ?? ""}
                  />
                  <InputError error={errors.name?.message} />
                </div>
              )}
            />

            <Divider className="col-span-1 md:col-span-2 -my-2" />

            <div className="col-span-1 md:col-span-2">
              <Label infoText="" label={t("comboPrice")} required />
            </div>

            <Controller
              name="code"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <div className="text-[#333333] mb-1 text-[14px]">
                    {t("comboCode")}{" "}
                  </div>
                  <CustomInput
                    className={`suffix-icon h-11 !rounded`}
                    placeholder="Mã combo tự động"
                    onChange={onChange}
                    value={value ?? ""}
                  />
                  <InputError error={errors.code?.message} />
                </div>
              )}
            />

            <div>
              <Controller
                name="price"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <div className="text-[#333333] mb-1 text-[14px]">
                      {t("sellPrice")}
                    </div>
                    <CustomInput
                      type="number"
                      className={`suffix-icon h-11 !rounded`}
                      placeholder="Nhập giá combo"
                      onChange={onChange}
                      value={value ?? ""}
                    />
                    <InputError error={errors.price?.message} />
                  </div>
                )}
              />
              <Controller
                name="isFixPrice"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="flex gap-2 items-center">
                    <CustomCheckbox
                      checked={value ?? false}
                      onChange={onChange}
                    />{" "}
                    <div className="text-[#333333] text-[14px]">
                      Nhập giá khi bán
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="card">
            <h1 className="text-[#1a1a1a] font-medium mb-1">
              {t("productsList")}
            </h1>
            <Search onSearch={handleSearch} onClick={() => setOpen(true)} />

            <div className="mt-4">
              <CustomTable
                dataSource={filteredProduct}
                columns={columns}
                locale={locale}
                scroll={{ x: 900 }}
                rowClassName={() => "hover-row"}
              />
              {product.length > 0 && (
                <div className="w-full h-[44px] bg-[#fff8f8] flex items-center justify-end text-[#1A1A1A] font-semibold text-[16px]">
                  Tổng tiền thành phần:{" "}
                  <span className="ml-8 mr-2 text-[16px]">
                    {" "}
                    {formatMoney(totalAmount)}
                  </span>
                </div>
              )}
            </div>

            {product.length > 0 && (
              <div className="flex justify-start mt-1">
                <CustomButton
                  type="outline"
                  className="!rounded-[50px]"
                  prefixIcon={<Image src={PlusIcon} />}
                  onClick={() => setOpen(true)}
                >
                  {t("addProducts")}
                </CustomButton>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 2xs:gap-4 lg:gap-6 flex flex-col">
          <div className="card">
            <Label infoText="" label={t("avatar")} />
            <div className="gap-4 flex flex-col">
              <CustomRadio
                options={[
                  { value: "picture", label: "Hình ảnh" },
                  { value: "color", label: "Màu sắc" },
                ]}
                value={avatarOption}
                onChange={(e) => {
                  setAvatarOption(e);
                }}
                gap={16}
              />
              <div>
                <div
                  className={`${
                    avatarOption === "picture" ? "h-[300px]" : ""
                  } w-full`}
                >
                  {avatarOption === "picture" ? (
                    <CustomUpload2
                      value={
                        getValues("avatarUrl")?.startsWith("#")
                          ? null
                          : getValues("avatarUrl")
                      }
                      type="type-2"
                      onChangeValue={(url) => setValue("avatarUrl", url)}
                    />
                  ) : (
                    <CustomColorPicker
                      values={
                        getValues("avatarUrl")
                          ? [getValues("avatarUrl")]
                          : (null as any)
                      }
                      onChangeValue={(value) =>
                        setValue("avatarUrl", value, {
                          shouldValidate: true,
                        })
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <Label infoText="" label={t("salesChannel")} />
            <div className="grid grid-row-2 gap-3">
              {radioOptions?.map((item, index) => (
                <CustomCheckbox key={index}>{item.label}</CustomCheckbox>
              ))}
            </div>
          </div>

          {/* <div className="card">
            <Controller
              name="categoryId"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div>
                    <Label infoText="" label={t("categories")} />
                    <CustomSelect
                      options={category?.data?.content?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      showSearch={true}
                      onChange={(selectedValues) => {
                        onChange(selectedValues);
                        setCategoryId(selectedValues);
                      }}
                      value={categoryId}
                      className="suffix-icon !rounded multiple h-11"
                      placeholder="Tìm kiếm danh mục"
                      mode="multiple"
                      allowClear
                    />
                    <InputError error={errors.categoryId?.message} />
                  </div>
                );
              }}
            />
          </div> */}

          <div className="card">
            <Controller
              name="menus"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div>
                    <Label infoText="" label={t("menu")} />
                    <CustomSelect
                      options={menu?.data?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      showSearch={true}
                      onChange={(selectedValues) => {
                        onChange(selectedValues);
                        setMenuId(selectedValues);
                      }}
                      value={menuId}
                      className="suffix-icon !rounded multiple h-11"
                      placeholder="Tìm kiếm danh mục"
                      mode="multiple"
                      allowClear
                    />
                    <InputError error={errors.menus?.message} />
                  </div>
                );
              }}
            />
            <p className="text-[#777] mt-4">
              Thêm mặt hàng vào thực đơn để dễ dàng tìm kiếm khi bán hàng
            </p>
          </div>

          <div className="card">
            <Controller
              name="barId"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <div>
                    <Label infoText="" label="Khu vực bar / bếp quản lý" />
                    <CustomSelect
                      onChange={onChange}
                      options={bar?.data?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      value={value}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                      placeholder="Chọn và tìm kiếm bar / bếp"
                    />
                    <InputError error={errors.barId?.message} />
                  </div>
                );
              }}
            />
            <Divider />
            <ul className="pl-[20px] text-start">
              <li className="list-disc text-[#777] leading-[28px] italic">
                Mặt hàng được quản lý theo bar / bếp để chế biến.
              </li>
              <li className="list-disc text-[#777] leading-[28px] italic">
                Mặt hàng chỉ được in khi đã được gán vào bar / bếp quản lý và
                thiết lập kết nối với máy in.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AddModal
        isOpen={open}
        branchId={branchId}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
        onSelection={handleProductSelection}
        Ids={productIds}
        variantId={productId}
        onRemove={handleRemove}
      />

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={onDelete}
        />
      )}
    </>
  );
};

export default DetailCombo;

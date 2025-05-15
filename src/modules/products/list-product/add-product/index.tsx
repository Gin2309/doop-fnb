import { useEffect, useState } from "react";
import { Button, Col, Divider, message, Row, Space } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ColumnsType } from "antd/es/table";

import { CustomButton } from "@/components/CustomButton";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomSwitch } from "@/components/CustomSwitch";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomRadio } from "@/components/CustomRadio";
import CustomUpload from "@/components/CustomUpload";
import { CustomCardItem } from "@/components/CustomCardItem";
import CustomColorPicker from "@/components/CustomColorPicker";
import InputError from "@/components/InputError";
import Label from "@/components/CustomLabel";
import Title from "@/components/Title";
import CustomTable from "@/components/CustomTable";

import { schemaProduct } from "./schema";
import ModalSpecialTime from "./SpecialTimeModal";

import PlusIcons from "@/assets/plusOrangeIcon.svg";
import XIcon from "@/assets/X.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import PenIcon from "@/assets/penIcon.svg";
import Edit from "@/assets/editBlue.svg";
import Delete from "@/assets/deleteRed.svg";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getDetailProduct,
  updateProduct,
} from "@/api/product.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { getCategory } from "@/api/category.service";

import { getSelectionGroup } from "@/api/selection-group.service";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { formatMoney } from "@/helpers";
import { createUnit, getUnit } from "@/api/unit.service";
import { getMenu } from "@/api/menu.service";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { getBar } from "@/api/kitchen.service";
import ButtonSelectionGroup from "./components/ButtonSelectionGroup";

const dayMapping: { [key: number]: string } = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  8: "Chủ nhật",
};
interface SpecialHour {
  name: string;
  price: number;
  isAllDay: boolean;
  startTime: string | null;
  endTime: string | null;
  date: string;
  duration: number | null;
  durationType?: number;
  type: number;
}

const generateBarCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const groupProduct = [
  { id: "QUANTITY", name: "Tính tiền theo số lượng" },
  { id: "WEIGHT", name: "Tính tiền theo trọng lượng " },
  { id: "TIME", name: "Tính tiền theo thời gian" },
];

const radioOptions = [
  { value: "1", label: "Bán tại nhà hàng" },
  { value: "2", label: "GrabFood" },
  { value: "3", label: "ShopeeFood" },
];

const AddProduct = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<SpecialHour[]>([]);
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchUnit, setSearchUnit] = useState("");

  const [isNameVisible, setIsNameVisible] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<string>("QUANTITY");
  const [isUserChanged, setIsUserChanged] = useState<boolean>(false);
  const [avatarOption, setAvatarOption] = useState("picture");
  const [openModalSpecialTime, setOpenModalSpecialTime] = useState(false);

  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const branch = useRecoilValue(branchStateSession);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: productDetail } = useQuery(
    ["PRODUCT", id, branch?.id],
    () => getDetailProduct(Number(id), Number(branch?.id)),
    { enabled: !!id && !!branch.id }
  );

  const { data: categories } = useQuery(["CATEGORY"], () =>
    getCategory({
      limit: 100,
      page: 1,
      branchId: branch?.id,
    })
  );

  const { data: units } = useQuery(["UNIT"], () =>
    getUnit({
      limit: 100,
      page: 1,
      branchId: branch?.id,
    })
  );

  const { data: menus } = useQuery(["MENU"], () =>
    getMenu({
      branchId: branch?.id,
    })
  );

  const { data: bars } = useQuery(["BAR"], () =>
    getBar({
      // limit: 100,
      // page: 1,
      branchId: branch?.id,
    })
  );

  const { refetch } = useQuery(
    ["SELECTION", branch?.id, keyword],
    () =>
      getSelectionGroup({
        limit: 100,
        page: 1,
        branchId: branch?.id,
        keyword,
      }),
    {
      enabled: !!branch.id,
      onSuccess: (data) => {
        setOptions(
          data?.data?.content
            .filter(
              (selection) =>
                !selectedItems.some((item) => item.value === selection.id)
            )
            .map((selection) => ({
              value: selection.id,
              label: selection.name,
            }))
        );
      },
    }
  );

  const { mutate: addUnit } = useMutation(createUnit, {
    onSuccess: () => {
      queryClient.invalidateQueries(["UNIT"]);
      message.success("Đơn vị đã được tạo thành công!");
    },
    onError: (error) => {
      message.error("Đã có lỗi xảy ra khi tạo đơn vị!");
    },
  });

  const handleAddUnit = async () => {
    if (!searchUnit || !branch?.id) return;

    await addUnit({ name: searchUnit, branchId: branch.id });
    setSearchUnit("");
  };

  const filteredUnits = units?.data?.content.filter((unit) =>
    unit.name.toLowerCase().includes(searchUnit.toLowerCase())
  );

  const handleSelect = (value: number) => {
    const selectedOption = options?.find((option) => option.value === value);
    if (selectedOption) {
      setSelectedItems((prevItems) => [...prevItems, selectedOption]);

      const updatedSelectionIds = [
        ...getValues("selectionGroupIds"),
        selectedOption.value,
      ];
      setValue("selectionGroupIds", updatedSelectionIds);
      setKeyword("");
      refetch();
    }
  };

  const handleRemove = (value: number) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.value !== value)
    );

    const updatedSelectionIds = getValues("selectionGroupIds").filter(
      (id: number) => id !== value
    );
    setValue("selectionGroupIds", updatedSelectionIds);
    refetch();
  };

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schemaProduct),
    mode: "onChange",
    defaultValues: {
      type: "QUANTITY",
      isPrint: false,
      isManageCode: false,
      isWarehouseLink: false,
      isSelectionGroup: false,
      branchId: branch.id,
      // isFirstHour: true,
      isSpecialHour: false,
      variantHourFirst: { duration: 1, durationType: "HOUR", price: 0 },
      variants: [
        {
          name: "giá thường",
          price: 0,
          primePrice: 0,
          code: "",
          barCode: generateBarCode(),
          isConfigPrice: false,
          isBase: true,
          duration: null,
          durationType: "HOUR",
        },
      ],
      // barId: productDetail ? productDetail?.data?.barId : bars?.data?.find(b => !!b.isDefault)?.id,
    },
  });

  const isSelectionGroupEnabled = watch("isSelectionGroup");
  const isFirstHourpEnabled = watch("isFirstHour");
  const isSpecialHourEnabled = watch("isSpecialHour");

  useEffect(() => {
    if (productDetail?.data?.isFirstHour === false && isFirstHourpEnabled) {
      setValue("variantHourFirst", {
        duration: 1,
        durationType: "HOUR",
        price: 0,
      });
    } else if (
      productDetail?.data?.isFirstHour === false &&
      !isFirstHourpEnabled
    ) {
      setValue("variantHourFirst", {
        duration: null,
        durationType: null,
        price: null,
      });
    }
  }, [isFirstHourpEnabled, setValue, productDetail]);

  useEffect(() => {
    let barId: number | undefined = undefined;
    if(productDetail?.data) {
      barId = productDetail?.data?.barId
    } else {
      const barDefault = bars?.data?.find(b => !!b.isDefault)?.id
      barId = barDefault
    }
    reset((prevValues) => ({
      ...prevValues,
      barId
    }))
  }, [bars?.data, productDetail?.data?.barId])

  useEffect(() => {
    if (productDetail?.data) {
      reset({
        ...productDetail.data,
        name: productDetail?.data?.name,
        branchId: productDetail?.data?.branchId,
        type: productDetail?.data?.type,
        unitId: productDetail?.data?.unit?.id,
        description: productDetail?.data?.description,
        variants:
          productDetail.data.variants?.map((variant) => ({
            id: variant?.id || null,
            code: variant.code || "",
            barCode: generateBarCode() || variant.code,
            name: variant.name || "",
            price: variant.price || 0,
            primePrice: variant.primePrice || 0,
            isConfigPrice: variant.isConfigPrice || false,
            isBase: variant.isBase || false,
            duration: variant.duration || null,
            durationType: variant.durationType || null,
          })) || [],
        avatarUrl: productDetail?.data?.avatarUrl,
        selectionGroupIds: productDetail.data.selectionGroupIds || [],
        menuIds: (productDetail?.data?.menus || []).map((menu) => menu.id),
        isPrint: productDetail.data.isPrint || false,
        isManageCode: productDetail.data.isManageCode || false,
        isWarehouseLink: productDetail.data.isWarehouseLink || false,
        isSelectionGroup: productDetail.data.isSelectionGroup || false,
        categoryId: productDetail.data.categoryId || "",
        isFirstHour: !!productDetail?.data?.isFirstHour,
      });

      setSelectedItems(
        (productDetail?.data?.productSelectionGroupDtos || []).map((item) => ({
          value: item.selectionGroup?.id,
          label: item.selectionGroup?.name,
        }))
      );
      setSelectedPaymentType(productDetail.data?.type || "");

      const isPicture =
        productDetail?.data.avatarUrl &&
        productDetail?.data.avatarUrl.startsWith("http");
      setAvatarOption(isPicture ? "picture" : "color");
    }
  }, [productDetail, reset]);

  useEffect(() => {
    if (selectedPaymentType === "TIME") {
      if(productDetail?.data) {
        reset((prevValues) => ({
          ...prevValues,
          isFirstHour: !!productDetail?.data?.isFirstHour,
          variantHourFirst: productDetail?.data?.isFirstHour
            ? {
              id: productDetail?.data?.variantHourFirst?.id,
              duration: productDetail?.data?.variantHourFirst?.duration || null,
              durationType:
                productDetail?.data?.variantHourFirst?.durationType || null,
              price: productDetail?.data?.variantHourFirst?.price || 0,
            }
            : {
              duration: null,
              durationType: null,
              price: null,
            },
          isSpecialHour: productDetail?.data?.isSpecialHour || false,
        }));
  
        const specialHoursData = (
          productDetail.data.variantHourSpecials || []
        ).map((hour) => ({
          price: hour.price,
          name: hour.name || "",
          startTime: hour.startTime,
          endTime: hour.endTime,
          date: hour.date || [],
          isAllDay: hour.isAllDay || false,
        }));
        setTableData(specialHoursData);
      } else {
        reset((prevValues) => ({
          ...prevValues,
          isFirstHour: true
        }))
      }
    }
  }, [selectedPaymentType, productDetail, reset]);

  useEffect(() => {
    if (isUserChanged) {
      reset({
        ...getValues(),
        variants: [
          {
            name: "",
            price: 0,
            primePrice: 0,
            code: "",
            barCode: generateBarCode(),
            isConfigPrice: false,
            isBase: true,
            duration: 1,
            durationType: "HOUR",
          },
        ],
      });
      setIsUserChanged(false);
    }
  }, [selectedPaymentType]);

  useEffect(() => {
    setValue(
      "selectionGroupIds",
      selectedItems.map((item) => item.value)
    );
  }, [selectedItems, setValue]);

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    if (productDetail?.data?.variants?.length) {
      replaceVariants(
        productDetail.data.variants.map((variant) => ({
          code: variant.code || "",
          id: variant?.id || null,
          barCode: generateBarCode() || variant.code,
          name: variant.name || "",
          price: variant.price || 0,
          primePrice: variant.primePrice || 0,
          isConfigPrice: variant.isConfigPrice || false,
          isBase: variant.isBase || false,
        }))
      );
    }
  }, [productDetail, replaceVariants]);

  const addVariant = () => {
    appendVariant({
      barCode: generateBarCode(),
      name: "",
      price: 0,
      primePrice: 0,
      code: "",
      isBase: true,
    });
    if (variantFields.length <= 1) {
      setIsNameVisible(true);
    }
  };

  const removeVariants = (index) => {
    removeVariant(index);

    if (variantFields.length === 2) {
      setIsNameVisible(false);
    } else if (variantFields.length > 2) {
      setIsNameVisible(true);
    } else {
      setIsNameVisible(false);
    }
  };

  useEffect(() => {
    if (variantFields.length > 1) {
      setIsNameVisible(true);
    } else {
      setIsNameVisible(false);
    }
  }, [variantFields]);

  const onConfirmSpecialHour = (specialHourData) => {
    const currentSpecialHours = getValues("variantHourSpecials") || [];
    let updatedSpecialHours;

    if (editIndex !== null) {
      updatedSpecialHours = currentSpecialHours.map((item, index) =>
        index === editIndex ? specialHourData : item
      );
      setEditIndex(null);
    } else {
      updatedSpecialHours = [...currentSpecialHours, specialHourData].filter(
        (item) =>
          item.price !== undefined && item.price !== null && item.price !== ""
      );
    }
    setTableData(updatedSpecialHours);
    setValue("variantHourSpecials", updatedSpecialHours);
    setOpenModalSpecialTime(false);
  };

  const handleDeleteSpecialHour = (index: number) => {
    const currentSpecialHours = getValues("variantHourSpecials") || [];
    const specialHourToDelete = currentSpecialHours[index];
    const allSpecialHours = currentSpecialHours
      .map((item) => (item === specialHourToDelete ? null : item))
      .filter((item) => item !== null);

    setTableData(allSpecialHours);
    setValue("variantHourSpecials", allSpecialHours);
  };

  const handleEditSpecialHour = (index: number) => {
    const currentSpecialHours = getValues("variantHourSpecials") || [];
    const specialHourToEdit = currentSpecialHours[index];
    setEditIndex(index);
    setEditData(specialHourToEdit);
    setOpenModalSpecialTime(true);
  };

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteProduct(Number(id), Number(branch.id));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["PRODUCT"]);
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleDelete = () => {
    setShowDeleteNoti({
      visible: false,
      content: "",
    });
    message.success("Xóa mặt hàng thành công");
    setTimeout(() => {
      router.back();
    }, 1000);
    mutateDelete();
  };

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      const payload: any = data;

      return productDetail
        ? updateProduct(productDetail?.data?.id, payload)
        : createProduct(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["PRODUCT"]);
        if (!productDetail) {
          message.success("Thêm mới thành công");
        } else {
          message.success("Cập nhật thành công");
        }
        router.back();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = async (data: any) => {
    // if (isSpecialHourEnabled && (data.variantHourSpecials || []).length === 0) {
    //   message.error("Vui lòng thêm khung giờ đặc biệt");
    //   return;
    // }

    const payload = { ...data };

    if (!isFirstHourpEnabled) {
      delete payload.variantHourFirst;
      payload.description = "";
    }

    if (!isSpecialHourEnabled) {
      delete payload.variantHourSpecials;
    }

    if (
      selectedPaymentType === "QUANTITY" ||
      selectedPaymentType === "WEIGHT"
    ) {
      delete payload.variantHourSpecials;
      delete payload.variantHourFirst;
      delete payload.isFirstHour;
    } else if (selectedPaymentType === "TIME") {
      delete payload.barId
      delete payload.bar
      delete payload.unit
      delete payload.unitId
    }

    data.variantHourSpecials = (data.variantHourSpecials || []).map((hour) => {
      return {
        id: hour?.id || "",
        name: hour.name || "",
        price: hour.price,
        isAllDay: hour.isAllDay || false,
        startTime: hour.startTime,
        endTime: hour.endTime,
        date: hour.date || [],
      };
    });
    mutate(payload);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Khung giờ",
      dataIndex: "code",
      key: "code",
      render: (_, record: any) => {
        if (record.isAllDay) {
          return "Cả ngày";
        }
        if (!record.startTime || !record.endTime) {
          return null;
        }
        return `${record.startTime} - ${record.endTime}`;
      },
    },
    {
      title: "Ngày trong tuần",
      dataIndex: "date",
      key: "date",
      render: (dates: number[]) => {
        return (dates || []).map((date) => dayMapping[date]).join(", ");
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (value: number) => formatMoney(value),
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record: any, index) => {
        return (
          <div className="flex gap-4 justify-center">
            <div
              className="cursor-pointer"
              onClick={() => handleEditSpecialHour(index)}
            >
              <Image src={Edit} width={20} height={20} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleDeleteSpecialHour(index)}
            >
              <Image src={Delete} width={20} height={20} />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="m-h-[100vh] pb-[50px]">
      <div className="bg-white border-t-[1px] h-[72px] shadow-lg flex justify-between items-center px-[20px] w-[calc(100% + 70px)] mx-[-35px]">
        <Title>
          {productDetail ? productDetail?.data?.name : "Thêm mới mặt hàng"}
        </Title>
        <Space>
          <CustomButton
            type="original"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          {productDetail && (
            <CustomButton
              type="danger"
              wrapClassName="w-[100px]"
              disabled={isLoadingDelete}
              onClick={() =>
                setShowDeleteNoti({
                  visible: true,
                  content: `Xóa ${getValues("name")}`,
                })
              }
            >
              Xóa
            </CustomButton>
          )}
          <CustomButton
            type="primary"
            wrapClassName="w-[100px]"
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoadingMutate}
            disabled={isLoadingMutate}
          >
            Lưu
          </CustomButton>
        </Space>
      </div>
      <div className="my-6 flex gap-6">
        <Row gutter={16} className="w-full">
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <CustomCardItem>
              <div className="p-6 mt-5">
                <div className="flex justify-between gap-[20px] mb-1">
                  <div className="flex-1">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-4">
                          <Label infoText="" label="Tên mặt hàng" required />
                          <CustomInput
                            {...field}
                            type="text"
                            placeholder="Nhập tên mặt hàng"
                            className="w-[100%] h-[44px] flex-1"
                          />
                          <InputError error={errors.name?.message} />
                        </div>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="type"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <div>
                            <Label infoText="" label="Loại mặt hàng" required />
                            <CustomSelect
                              options={groupProduct?.map((item) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              showSearch={true}
                              onChange={(newValue) => {
                                onChange(newValue);
                                setSelectedPaymentType(newValue);
                                setIsUserChanged(true);
                              }}
                              value={value}
                              className="suffix-icon h-11 !rounded"
                              placeholder="Chọn loại mặt hàng"
                            />
                            <InputError error={errors.type?.message} />
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>

                <Divider className="my-[6px]" />
                <h2 className="font-semibold my-4">
                  {selectedPaymentType === "QUANTITY" ||
                    selectedPaymentType === "WEIGHT"
                    ? "Giá mặt hàng"
                    : selectedPaymentType === "TIME"
                      ? "Giá bán thường"
                      : null}
                </h2>
                {(selectedPaymentType === "QUANTITY" ||
                  selectedPaymentType === "WEIGHT") && (
                    <div className="mb-3">
                      {variantFields.map((selection, index) => (
                        <div
                          key={selection.id}
                          className="flex justify-between items-start gap-[15px] mb-3 "
                        >
                          <div className="flex-1">
                            <Label
                              infoText=""
                              label="Mã mặt hàng"
                              className="font-normal"
                            />
                            <Controller
                              name={`variants[${index}].code`}
                              control={control}
                              render={({ field }) => (
                                <CustomInput
                                  {...field}
                                  type="text"
                                  className="w-[100%] h-[44px] flex-1 mb-1"
                                />
                              )}
                            />
                            <InputError
                              error={errors?.variants?.[index]?.code?.message}
                            />
                          </div>
                          {isNameVisible && (
                            <div className="flex-1">
                              <Label
                                infoText=""
                                label="Tên giá"
                                className="font-normal"
                              />
                              <Controller
                                name={`variants[${index}].name`}
                                control={control}
                                render={({ field }) => (
                                  <CustomInput
                                    {...field}
                                    type="text"
                                    className="w-[100%] h-[44px] flex-1 mb-1"
                                  />
                                )}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <Label
                              infoText=""
                              label="Giá bán"
                              className="font-normal"
                            />
                            <Controller
                              name={`variants[${index}].price`}
                              control={control}
                              render={({ field }) => (
                                <CustomInput
                                  {...field}
                                  type="number"
                                  className="w-[100%] h-[44px] flex-1 mb-1"
                                />
                              )}
                            />

                            <Controller
                              name={`variants.${index}.isConfigPrice`}
                              control={control}
                              defaultValue={false}
                              render={({ field }) => (
                                <div>
                                  <CustomCheckbox
                                    checked={field.value}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.checked);
                                    }}
                                  >
                                    <strong className="font-light">
                                      Nhập giá khi bán
                                    </strong>
                                  </CustomCheckbox>
                                </div>
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <Label
                              infoText=""
                              label="Giá vốn"
                              className="font-normal"
                            />
                            <Controller
                              name={`variants[${index}].primePrice`}
                              control={control}
                              render={({ field }) => (
                                <CustomInput
                                  {...field}
                                  type="number"
                                  className="w-[100%] h-[44px] flex-1 mb-1"
                                />
                              )}
                            />
                          </div>
                          <div
                            className="p-1 mt-[35px] cursor-pointer"
                            onClick={() => removeVariants(index)}
                          >
                            <Image src={XIcon} alt="Delete Icon" />
                          </div>
                        </div>
                      ))}

                      <CustomButton
                        type="none"
                        className="!w-fit text-[#F38B25]"
                        prefixIcon={<Image src={PlusIcons} alt="Plus Icon" />}
                        onClick={addVariant}
                      >
                        Thêm giá
                      </CustomButton>
                    </div>
                  )}

                {selectedPaymentType !== "TIME" && (
                  <div className="flex-1">
                    <Label infoText="" label="Đơn vị" required />
                    <Controller
                      name="unitId"
                      control={control}
                      render={({ field }) => (
                        <div className="mb-4">
                          <CustomSelect
                            {...field}
                            options={filteredUnits?.map((item) => ({
                              label: item?.name,
                              value: item?.id,
                              name: item?.name,
                            }))}
                            onChange={(value) => field.onChange(value)}
                            showSearch={true}
                            className="suffix-icon h-11 !rounded"
                            placeholder="Chọn hoặc nhập tên đơn vị"
                            onSearch={(value) => setSearchUnit(value)}
                            dropdownRender={(menu) => (
                              <>
                                {searchUnit && (
                                  <div
                                    className="flex gap-2 cursor-pointer bg-[#eee] p-2 hover:bg-blue-500 hover:text-[#fff]"
                                    onClick={() => handleAddUnit()}
                                  >
                                    <Image
                                      src={PlusIcons}
                                      alt="Plus Icon"
                                      className="cursor-pointer"
                                    />
                                    Thêm đơn vị "{searchUnit}"
                                  </div>
                                )}

                                {menu}
                              </>
                            )}
                          />
                          <InputError error={errors.unitId?.message} />
                        </div>
                      )}
                    />
                  </div>
                )}

                {selectedPaymentType === "TIME" && (
                  <div className="flex justify-between flex-wrap md:flex-nowrap mb-4  gap-[20px]">
                    <div className="flex-1">
                      <Label
                        infoText=""
                        label="Mã mặt hàng"
                        className="font-normal"
                      />
                      <Controller
                        name="variants[0].code"
                        control={control}
                        render={({ field }) => (
                          <CustomInput
                            {...field}
                            type="text"
                            className="w-[100%] h-[44px] flex-1 mb-1"
                          />
                        )}
                      />
                      <InputError
                        error={errors?.variants?.[0]?.code?.message}
                      />
                    </div>
                    <div className="flex-1 ">
                      <Label
                        infoText=""
                        label="Giá bán"
                        className="font-normal"
                      />
                      <Controller
                        name="variants[0].price"
                        control={control}
                        render={({ field }) => (
                          <CustomInput
                            {...field}
                            type="number"
                            className="w-[100%] h-[44px] flex-1"
                          />
                        )}
                      />
                      <InputError
                        error={errors?.variants?.[0]?.price?.message}
                      />

                      <Controller
                        name="variants[0].isConfigPrice"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <div>
                            <CustomCheckbox
                              checked={field.value}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                              }}
                            >
                              <strong className="font-light">
                                Nhập giá khi bán
                              </strong>
                            </CustomCheckbox>
                          </div>
                        )}
                      />
                    </div>
                    <div className="flex-1 ">
                      <Label
                        infoText=""
                        label="Áp dụng cho mỗi khoảng thời gian"
                        className="font-normal"
                      />
                      <div className="input-time">
                        <div className="flex">
                          <div className="flex-1">
                            <Controller
                              name="variants[0].duration"
                              control={control}
                              render={({ field }) => (
                                <CustomInput
                                  {...field}
                                  className="h-[44px]"
                                  type="number"
                                />
                              )}
                            />
                          </div>

                          <div className="w-[100px] input-type--time">
                            <Controller
                              name="variants[0].durationType"
                              control={control}
                              render={({ field }) => (
                                <CustomSelect
                                  {...field}
                                  className="h-[44px]"
                                  options={[
                                    { label: "Phút", value: "MINUTE" },
                                    { label: "Giờ", value: "HOUR" },
                                    { label: "Ngày", value: "DAY" },
                                  ]}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CustomCardItem>

            <CustomCardItem>
              <div className="p-6 mt-5">
                {selectedPaymentType !== "TIME" ? (
                  <div>
                    <div className="flex items-center justify-between py-[10px]">
                      <Label infoText="" label="In tem mặt hàng" />
                      <Controller
                        name="isPrint"
                        control={control}
                        render={({ field }) => <CustomSwitch {...field} />}
                      />
                    </div>

                    <Divider className="my-[3px]" />

                    <div className="flex items-center justify-between py-[10px]">
                      <Label infoText="" label="Quản lý mã" />
                      <Controller
                        name="isManageCode"
                        control={control}
                        render={({ field }) => <CustomSwitch {...field} />}
                      />
                    </div>

                    <Divider className="my-[3px]" />

                    <div>
                      <div className="flex items-center justify-between py-[10px]">
                        <Label infoText="" label="Liên kết kho hàng" />
                        <Controller
                          name="isWarehouseLink"
                          control={control}
                          render={({ field }) => <CustomSwitch {...field} />}
                        />
                      </div>
                    </div>

                    <Divider className="my-[3px]" />

                    <div>
                      <div className="flex items-center justify-between py-[10px]">
                        <Label infoText="" label="Nhóm lựa chọn" />

                        <Controller
                          name="isSelectionGroup"
                          control={control}
                          render={({ field }) => <CustomSwitch {...field} />}
                        />
                      </div>
                      {isSelectionGroupEnabled && (
                        <div className="mb-4">
                          <Space.Compact block>
                            <div className="flex-1">
                              <CustomAutocomplete
                                showSearch
                                className="h-11 flex-1 !rounded-none"
                                options={options}
                                placeholder="Tìm kiếm nhóm lựa chọn"
                                value={keyword}
                                onSelect={handleSelect}
                                onChange={(value) => setKeyword(value)}
                              />
                            </div>
                            <CustomButton
                              type="submit"
                              prefixIcon={<Image src={SearchIcon} />}
                              onClick={() => refetch()}
                            >
                              Tìm kiếm
                            </CustomButton>
                          </Space.Compact>

                          <div className="mt-3 ">
                            {selectedItems.map((item) => (
                              <div
                                key={item.value}
                                className="flex justify-between gap-[30px] py-4"
                              >
                                <span>{item?.label}</span>
                                <div className="flex gap-[15px] w-[20%] justify-end">
                                  <Image
                                    src={PenIcon}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      router.push(
                                        `/products/selection-group/${item?.value}`
                                      );
                                    }}
                                  />
                                  <Image
                                    src={XIcon}
                                    className="cursor-pointer"
                                    onClick={() => handleRemove(item.value)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* <CustomButton
                            type="none"
                            className="!w-fit text-[#F38B25]"
                            prefixIcon={
                              <Image src={PlusIcons} alt="Plus Icon" />
                            }
                            onClick={() => {
                              router.push(`/products/selection-group/add`);
                            }}
                          >
                            Thêm nhóm lựa chọn
                          </CustomButton> */}
                          <ButtonSelectionGroup
                            isNew={!productDetail?.data}
                          />
                        </div>
                      )}
                    </div>

                    <Divider className="my-[3px]" />

                    <div className="my-4">
                      <Label infoText="" label="Mô tả" />
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CustomTextarea
                              {...field}
                              placeholder="Nhập mô tả"
                              rows={7}
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between py-[10px]">
                        <Label
                          infoText=""
                          label="Giá bán cho khung thời gian sử dụng đầu tiên"
                        />

                        <Controller
                          name="isFirstHour"
                          control={control}
                          render={({ field }) => <CustomSwitch {...field} />}
                        />
                      </div>
                      {isFirstHourpEnabled && (
                        <>
                          <div className="flex justify-between gap-[20px]">
                            <div className="flex-1">
                              <Label
                                infoText=""
                                label="Thời gian sử dụng đầu tiên"
                                className="font-normal"
                              />
                              <div className="input-time">
                                <div className="flex">
                                  <div className="flex-1">
                                    <Controller
                                      name="variantHourFirst.duration"
                                      control={control}
                                      render={({ field }) => (
                                        <div>
                                          <CustomInput
                                            {...field}
                                            className="h-[44px] "
                                            type="number"
                                          />
                                        </div>
                                      )}
                                    />
                                  </div>
                                  <div className="w-[100px] input-type--time">
                                    <Controller
                                      name="variantHourFirst.durationType"
                                      control={control}
                                      render={({ field }) => (
                                        <>
                                          <CustomSelect
                                            {...field}
                                            className="h-[44px]"
                                            options={[
                                              {
                                                label: "Phút",
                                                value: "MINUTE",
                                              },
                                              { label: "Giờ", value: "HOUR" },
                                              {
                                                label: "Ngày",
                                                value: "DAY",
                                              },
                                            ]}
                                          />
                                        </>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <Label
                                infoText=""
                                label="Giá bán"
                                className="font-normal"
                              />
                              <Controller
                                name="variantHourFirst.price"
                                control={control}
                                render={({ field }) => (
                                  <CustomInput
                                    {...field}
                                    type="number"
                                    className="w-[100%] h-[44px] flex-1 mb-1"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <Label infoText="" label="Mô tả" />
                            <Controller
                              name="description"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <CustomTextarea
                                    {...field}
                                    placeholder="Nhập mô tả"
                                    rows={7}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <Divider />
                    {/* <div>
                      <div className="flex items-center justify-between py-[10px]">
                        <Label infoText="" label="Thời gian đặc biệt" />
                        <Controller
                          name="isSpecialHour"
                          control={control}
                          render={({ field }) => <CustomSwitch {...field} />}
                        />
                      </div>

                      {isSpecialHourEnabled && (
                        <div>
                          <CustomTable
                            dataSource={tableData}
                            columns={columns}
                          />
                          <CustomButton
                            type="none"
                            className="!w-fit text-[#F38B25]"
                            prefixIcon={<Image src={PlusIcons} />}
                            onClick={() => {
                              setOpenModalSpecialTime(true);
                              setEditData(null);
                            }}
                          >
                            Thêm khung giờ
                          </CustomButton>
                        </div>
                      )}
                    </div> */}
                  </div>
                )}
              </div>
            </CustomCardItem>
          </Col>

          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <CustomCardItem className=" !bg-white my-4">
              <div className="p-[15px]">
                <Label infoText="" label="Hình đại diện" required={false} />
                <CustomRadio
                  options={[
                    { value: "picture", label: "Hình ảnh" },
                    { value: "color", label: "Màu sắc" },
                  ]}
                  value={avatarOption}
                  onChange={(e) => {
                    setAvatarOption(e);
                  }}
                  gap={32}
                />

                <div className="mt-2">
                  {avatarOption === "picture" ? (
                    <CustomUpload
                      type="type-2"
                      value={getValues("avatarUrl")}
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
            </CustomCardItem>
            {selectedPaymentType !== "TIME" && (
              <CustomCardItem className="mb-4">
                <div className="p-6">
                  <Label infoText="" label="Kênh bán hàng" />
                  <div className="grid grid-row-2 gap-3">
                    {radioOptions?.map((item, index) => (
                      <CustomCheckbox key={index}>{item.label}</CustomCheckbox>
                    ))}
                  </div>
                </div>
              </CustomCardItem>
            )}
            <CustomCardItem className="mb-4">
              <div className="p-6">
                <Label infoText="" label="Danh mục" />

                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <CustomSelect
                        {...field}
                        options={categories?.data?.content?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          name: item.name,
                        }))}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        showSearch={true}
                        className="suffix-icon h-11 !rounded"
                        placeholder="Tìm kiếm danh mục"
                      />
                    </div>
                  )}
                />
              </div>
            </CustomCardItem>

            <CustomCardItem className="mb-4">
              <div className="p-6">
                <Label infoText="" label="Thực đơn" />

                <Controller
                  name="menuIds"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <CustomSelect
                        {...field}
                        mode="tags"
                        options={menus?.data?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          name: item.name,
                        }))}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        showSearch={true}
                        className="suffix-icon h-11 !rounded multiple"
                        placeholder="Tìm kiếm thực đơn"
                        allowClear
                      />
                    </div>
                  )}
                />

                <p className="text-[#777] mt-4">
                  Thêm mặt hàng vào thực đơn để dễ dàng tìm kiếm khi bán hàng
                </p>
              </div>
            </CustomCardItem>
            {!(selectedPaymentType === "TIME") && (
              <CustomCardItem className="mb-4">
                <div className="p-6">
                  <Controller
                    name="barId"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <div>
                          <Label
                            infoText=""
                            label="Khu vực bar / bếp quản lý"
                          />
                          <CustomSelect
                            options={bars?.data?.map((item) => ({
                              label: item.name,
                              value: item.id,
                            }))}
                            showSearch={true}
                            onChange={onChange}
                            value={value}
                            className="suffix-icon !rounded multiple h-11"
                            placeholder="Tìm kiếm danh mục"
                            allowClear
                          />
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
                      Mặt hàng chỉ được in khi đã được gán vào bar / bếp quản lý
                      và thiết lập kết nối với máy in.
                    </li>
                  </ul>
                </div>
              </CustomCardItem>
            )}
          </Col>
        </Row>
      </div>

      <ModalSpecialTime
        title={
          editData ? "Chỉnh sửa khung giờ đặc biệt" : "Thêm khung giờ đặc biệt"
        }
        isOpen={openModalSpecialTime}
        onCancel={() => {
          setOpenModalSpecialTime(false);
          setEditData(null);
        }}
        onConfirm={onConfirmSpecialHour}
        editData={editData}
      />

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={handleDelete}
        />
      )}
    </div>
  );
};

export default AddProduct;

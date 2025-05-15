import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Title from "@/components/Title";
import Label from "@/components/CustomLabel";
import {
  Button,
  Col,
  Divider,
  Flex,
  InputNumber,
  message,
  Row,
  Space,
  Table,
} from "antd";

import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSwitch } from "@/components/CustomSwitch";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { useRouter } from "next/router";
import { schemaVoucher } from "./schema";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "@/components/InputError";
import { CustomCardItem } from "@/components/CustomCardItem";
import PlusIcons from "@/assets/plusOrangeIcon.svg";
import Image from "next/image";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { getCategory } from "@/api/category.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import XIcon from "@/assets/X.svg";
import { getCustomerGroupList } from "@/api/customer-group.service";
import SortingIcon from "@/assets/column-sorting.svg";
import {
  ActiveVoucher,
  createVoucher,
  deleteVoucher,
  getDetailVoucher,
  InActiveVoucher,
  updateVoucher,
} from "@/api/voucher.service";
import { getMenu } from "@/api/menu.service";
import dayjs from "dayjs";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import ModalProducts from "./ModalProduct";
import ModalFreeItems from "./FreeItemProduct";
import { formatMoney } from "@/helpers";
import ModalChangeStatus from "./ModalChangeStatus";

type Variant = {
  variantId: number;
  name: string;
  quantity: number;
  avatarUrl: string;
  price: number;
  productName: string;
};

const radioCustomer = [
  { value: true, label: "Tất cả khách hàng" },
  { value: false, label: "Nhóm khách hàng" },
];

const voucherTypeGroup = [
  { id: "PERCENT", name: "Theo phần trăm" },
  { id: "AMOUNT", name: "Theo số tiền" },
  { id: "FIXEDPRICE", name: "Đồng giá" },
  { id: "FREEITEM", name: "Tặng món" },
];

const daysOfWeek = [
  { label: "Thứ 2", value: 2 },
  { label: "Thứ 3", value: 3 },
  { label: "Thứ 4", value: 4 },
  { label: "Thứ 5", value: 5 },
  { label: "Thứ 6", value: 6 },
  { label: "Thứ 7", value: 7 },
  { label: "Chủ nhật", value: 1 },
];

interface ModalChangeStatusState {
  visible: boolean;
  content: string;
  action: (() => void) | null;
}

const AddVoucher = ({ id }: { id?: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showEndDate, setShowEndDate] = useState(false);
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const [isUserChanged, setIsUserChanged] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalFreeItem, setOpenModalFreeItem] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [freeItem, setFreeItem] = useState<Variant[]>([]);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const [modalChangeStatus, setmodalChangeStatus] =
    useState<ModalChangeStatusState>({
      visible: false,
      content: "",
      action: null,
    });

  const { data: categories } = useQuery(["CATEGORY"], () =>
    getCategory({
      limit: 100,
      page: 1,
      branchId: branch?.id,
    })
  );

  const { data: customers } = useQuery(["CUSTOMER"], () =>
    getCustomerGroupList({
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

  const { data: vouchersDetail } = useQuery(
    ["VOUCHER", id, branch?.id],
    () => getDetailVoucher(Number(id), Number(branch?.id)),
    { enabled: !!id && !!branch.id }
  );

  const handleAddVariants = (newVariants: Variant[]) => {
    const mergedVariants = [...variants];

    newVariants.forEach((newVariant) => {
      const existing = mergedVariants.find(
        (v) => v.variantId === newVariant.variantId
      );
      if (existing) {
        existing.quantity = newVariant.quantity;
      } else {
        mergedVariants.push(newVariant);
      }
    });
    setVariants(mergedVariants);
    setValue("variants", mergedVariants);
  };

  const handleAddFreeItem = (newVariants: Variant[]) => {
    const mergedVariants = [...variants];

    newVariants.forEach((newVariant) => {
      const existing = mergedVariants.find(
        (v) => v.variantId === newVariant.variantId
      );
      if (existing) {
        existing.quantity = newVariant.quantity;
      } else {
        mergedVariants.push(newVariant);
      }
    });
    const freeItemIds = mergedVariants.map((variant) => variant.variantId);
    setFreeItem(mergedVariants);
    setValue("freeItems", freeItemIds);
  };

  const handleDaySelection = (dayValue) => {
    const currentDays = selectedDays;
    if (currentDays.includes(dayValue)) {
      setValue(
        "dayOfWeek",
        currentDays.filter((day) => day !== dayValue)
      );
    } else {
      setValue("dayOfWeek", [...currentDays, dayValue]);
    }
  };

  const { mutate: mutateDelete } = useMutation(
    () => {
      return deleteVoucher(Number(id), branch?.id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["VOUCHER"]);
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
        message.success("Xóa thành công!");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleDelete = () => {
    mutateDelete();
    router.back();
  };

  const { mutate: inactivateVoucher, isLoading: isInactivating } = useMutation({
    mutationFn: () => InActiveVoucher(Number(id), branch?.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["VOUCHER", id, branch?.id]);
      message.success("Thẻ giảm giá đã được ngưng hoạt động!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const { mutate: activateVoucher, isLoading: isActivating } = useMutation({
    mutationFn: () => ActiveVoucher(Number(id), branch?.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["VOUCHER", id, branch?.id]);
      message.success("Thẻ giảm giá đã được kích hoạt!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleClick = () => {
    if (vouchersDetail?.data?.isActive) {
      setmodalChangeStatus({
        visible: true,
        content: "Bạn có chắc chắn muốn ngưng hoạt động thẻ giảm giá này?",
        action: inactivateVoucher,
      });
    } else {
      setmodalChangeStatus({
        visible: true,
        content: "Bạn có chắc chắn muốn kích hoạt thẻ giảm giá này?",
        action: activateVoucher,
      });
    }
  };

  const handleConfirmChange = () => {
    if (modalChangeStatus.action) {
      modalChangeStatus.action();
    }
    setmodalChangeStatus({ visible: false, content: "", action: null });
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
    resolver: yupResolver(schemaVoucher),
    mode: "onChange",
    defaultValues: {
      applyType: "ORDER",
      isAllCustomer: true,
      isOnlineChannel: false,
      isNoApplySelection: false,
      isApplyItem: false,
      isDayOfWeek: false,
      isHaveTimeSlot: false,
      isAutoApply: true,
      categories: [],
      dayOfWeek: [],
      groupCustomer: [],
      startDay: dayjs().format("YYYY-MM-DD HH:mm"),
      endDay: "",
      type: "PERCENT",
      timeSlot: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
  });
  const isDayOfWeekEnabled = watch("isDayOfWeek");
  const isHaveTimeSlotEnabled = watch("isHaveTimeSlot");
  const applyType = watch("applyType");
  const voucherType = watch("type");
  const isAllCustomer = watch("isAllCustomer");
  const selectedDays = watch("dayOfWeek") || [];

  useEffect(() => {
    if (voucherType === "FIXEDPRICE" && !vouchersDetail) {
      setValue("applyType", "CATEGORY");
    }

    if (voucherType === "FREEITEM" && !vouchersDetail) {
      setValue("applyType", "ITEM");
    }

    if (voucherType === "PERCENT" && !vouchersDetail) {
      setValue("applyType", "ORDER");
    }
  }, [voucherType, setValue]);

  const radioType = [
    { value: "ORDER", label: "Hóa đơn" },
    { value: "CATEGORY", label: "Danh mục" },
    { value: "ITEM", label: "Mặt hàng" },
  ];

  const filteredRadioType = radioType.filter((option) => {
    if (voucherType === "FIXEDPRICE") {
      return option.value !== "ORDER";
    }
    if (voucherType === "FREEITEM") {
      return option.value !== "CATEGORY";
    }

    return true;
  });

  useEffect(() => {
    if (isUserChanged) {
      setValue("discountValue", null);
      setValue("minBillValue", null);
      setValue("maxDiscount", null);
      setIsUserChanged(false);
    }
  }, [voucherType]);

  useEffect(() => {
    if (isHaveTimeSlotEnabled) {
      const hournow = dayjs().format("HH:mm");
      const currentTime = dayjs(hournow, "HH:mm");
      const endTime = dayjs("23:59", "HH:mm");
      setValue("timeSlot.0.startTime", currentTime);
      setValue("timeSlot.0.endTime", endTime);
    }
  }, [isHaveTimeSlotEnabled]);

  useEffect(() => {
    if (vouchersDetail?.data) {
      const formattedTimeSlot =
        vouchersDetail?.data?.timeSlot?.map((slot) => {
          const formattedStartTime =
            slot.startTime && dayjs(slot.startTime, "HH:mm:ss", true).isValid()
              ? dayjs(slot.startTime, "HH:mm:ss")
              : null;

          const formattedEndTime =
            slot.endTime && dayjs(slot.endTime, "HH:mm:ss", true).isValid()
              ? dayjs(slot.endTime, "HH:mm:ss")
              : null;
          return {
            startTime: dayjs(slot.startTime, "HH:mm:ss"),
            endTime: dayjs(slot.endTime, "HH:mm:ss"),
          };
        }) || [];

      const updatedVariants =
        vouchersDetail?.data?.variants?.map((variant) => ({
          variantId: variant?.id,
          name: variant?.name,
          quantity: variant?.quantity,
          avatarUrl: variant?.avatarUrl,
          price: variant?.price,
          productName: variant?.productName,
        })) || [];

      const updatedFreeItem =
        vouchersDetail?.data?.gifts?.map((variant) => ({
          variantId: variant?.id,
          name: variant?.name,
          avatarUrl: variant?.avatarUrl,
          price: variant?.price,
          productName: variant?.productName,
        })) || [];

      const updatedFreeItems =
        vouchersDetail?.data?.gifts?.map((variant) => variant?.id) || [];

      reset({
        branchId: vouchersDetail?.data?.branchId || "",
        name: vouchersDetail?.data?.name || "",
        type: vouchersDetail?.data?.type || "",
        discountValue: vouchersDetail?.data?.discountValue || 0,
        minBillValue: vouchersDetail?.data?.minBillValue || 0,
        maxDiscount: vouchersDetail?.data?.maxDiscount || 0,
        isAutoApply: vouchersDetail?.data?.isAutoApply || false,
        startDay: vouchersDetail?.data?.startDay
          ? dayjs(vouchersDetail?.data?.startDay).format("YYYY-MM-DD HH:mm")
          : "",
        endDay: vouchersDetail?.data?.endDay
          ? dayjs(vouchersDetail?.data?.endDay).format("YYYY-MM-DD HH:mm")
          : "",
        isHaveTimeSlot: vouchersDetail?.data?.isHaveTimeSlot || false,
        timeSlot: formattedTimeSlot,
        isDayOfWeek: vouchersDetail?.data?.isDayOfWeek || false,
        dayOfWeek: vouchersDetail?.data?.dayOfWeek
          ? vouchersDetail?.data?.dayOfWeek.split(",").map(Number)
          : [],
        applyType: vouchersDetail?.data?.applyType || "",
        categories:
          vouchersDetail?.data?.categories?.map(
            (category) => category.categoryId
          ) || [],
        freeItems: vouchersDetail?.data?.freeItems?.map(
          (item: any) => item?.id
        ),
        variants:
          vouchersDetail?.data?.variants?.map((variant) => ({
            variantId: variant?.id,
            quantity: variant?.quantity,
          })) || [],
        isNoApplySelection: vouchersDetail?.data?.isNoApplySelection || false,
        maxQuantityGift: vouchersDetail?.data?.maxQuantityGift || 1,
        isAllCustomer: vouchersDetail?.data?.isAllCustomer || false,
        groupCustomer:
          vouchersDetail?.data?.groupCustomer?.map(
            (item) => item.groupCustomerId
          ) || [],
        isOnlineChannel: vouchersDetail?.data?.isOnlineChannel || false,
        menu: vouchersDetail?.data?.menu?.map((item) => item.menuId) || [],
        isApplyItem: vouchersDetail?.data?.isApplyItem || false,
      });

      setValue("timeSlot", formattedTimeSlot);
      setValue("variants", updatedVariants);
      setVariants(updatedVariants);
      setValue("freeItems", updatedFreeItems);
      setFreeItem(updatedFreeItem);
      setShowEndDate(!!vouchersDetail?.data?.endDay);
    }
  }, [vouchersDetail, reset]);

  const handleCheckboxChange = () => {
    setShowEndDate(!showEndDate);
    if (showEndDate) {
      setValue("endDay", null);
    }
  };

  const {
    fields: otherFields,
    append: appendFields,
    remove: removeFields,
    replace: replaceSlotTime,
  } = useFieldArray({
    control,
    name: "timeSlot",
  });

  const addTimeSlot = () => {
    appendFields({
      startTime: "",
      endTime: "",
    });
  };

  useEffect(() => {
    if (vouchersDetail?.data) {
      replaceSlotTime(
        vouchersDetail?.data?.timeSlot.map((slot) => ({
          startTime:
            dayjs(slot.startTime, "HH:mm:ss") ||
            dayjs(slot.startTime, "HH:mm", true).isValid(),
          endTime:
            dayjs(slot.endTime, "HH:mm:ss") ||
            dayjs(slot.endTime, "HH:mm", true).isValid(),
        }))
      );
    }
  }, [vouchersDetail, replaceSlotTime]);

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      const payload: any = data;
      return vouchersDetail?.data
        ? updateVoucher(vouchersDetail?.data?.id, payload)
        : createVoucher(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["VOUCHER"]);
        if (!vouchersDetail) {
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
    if (isDayOfWeekEnabled && (data?.dayOfWeek || []).length === 0) {
      message.error("Vui lòng chọn ít nhất một thứ trong tuần!");
      return;
    }

    if (showEndDate && !data.endDay) {
      message.error("Vui lòng nhập thời gian kết thúc!");
      return;
    }

    const allTimeSlotsEmpty = data.timeSlot.every(
      (slot) => !slot.startTime || !slot.endTime
    );

    if (isHaveTimeSlotEnabled && allTimeSlotsEmpty) {
      message.error(
        "Vui lòng nhập thời gian bắt đầu và kết thúc cho áp dụng các khung giờ!"
      );
      return;
    }

    if (
      !isAllCustomer &&
      (!data?.groupCustomer || data?.groupCustomer.length === 0)
    ) {
      message.error("Vui lòng chọn ít nhất một nhóm khách hàng");
      return;
    }

    if (applyType !== "ORDER") {
      if (
        applyType === "ITEM" &&
        (!data?.variants || data?.variants.length === 0)
      ) {
        message.error("Vui lòng chọn ít nhất một sản phẩm");
        return;
      }

      if (
        applyType === "CATEGORY" &&
        (!data?.categories || data?.categories.length === 0)
      ) {
        message.error("Vui lòng chọn ít nhất một danh mục");
        return;
      }
    }

    const updatedTimeSlots = data.timeSlot
      .map((slot: any) => ({
        startTime: dayjs(slot.startTime).isValid()
          ? dayjs(slot.startTime).format("HH:mm")
          : null,
        endTime: dayjs(slot.endTime).isValid()
          ? dayjs(slot.endTime).format("HH:mm")
          : null,
      }))
      .filter((slot) => slot.startTime && slot.endTime);

    const formattedProducts = data?.variants?.map((item: any) => ({
      variantId: item?.variantId,
      quantity: item?.quantity,
    }));

    const payload = {
      ...data,
      branchId: branch?.id,
      timeSlot: updatedTimeSlots,
      variants: formattedProducts,
    };
    try {
      await mutate(payload);
    } catch (error: any) {
      message.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <div className="bg-white border-t-[1px] h-[72px] shadow-lg gap-[30px] flex justify-between items-center px-[20px] w-[calc(100% + 70px)] mx-[-35px]">
        <Title>
          {vouchersDetail ? vouchersDetail?.data?.name : "Thêm mới giảm giá"}
        </Title>
        <Space>
          <CustomButton
            type="original"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>

          {vouchersDetail?.data && (
            <CustomButton
              type="danger"
              wrapClassName="w-[100px]"
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

          {vouchersDetail?.data && (
            <CustomButton
              type={vouchersDetail?.data?.isActive ? "link" : "green-btn"}
              className="min-w-[100px] !h-[40px]"
              disabled={
                vouchersDetail?.data?.isActive ? isActivating : isInactivating
              }
              onClick={handleClick}
            >
              {vouchersDetail?.data?.isActive
                ? "Ngưng hoạt động"
                : "Bật hoạt động"}
            </CustomButton>
          )}

          <CustomButton
            type="primary"
            wrapClassName="w-[100px]"
            disabled={isLoadingMutate}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </CustomButton>
        </Space>
      </div>

      <Row gutter={16} className="w-full">
        <Col xs={24} sm={24} md={24} lg={15} xl={15}>
          <div className="card my-5">
            <div>
              <Label infoText="" label={t("voucherName")} required />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <CustomInput
                      {...field}
                      type="text"
                      placeholder="Nhập tên khuyễn mãi"
                      className="w-[100%] h-[44px] flex-1"
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />
            </div>
          </div>
          {/* 2 */}
          <div className="card mb-5">
            <h1 className="text-[#1a1a1a] font-semibold text-[20px] uppercase ">
              {t("customVoucher")}
            </h1>
            <div className="my-6 grid 2xs:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <div>
                <Label infoText="" label={t("voucherType")} required />
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <CustomSelect
                        {...field}
                        options={voucherTypeGroup?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        onChange={(value) => {
                          field.onChange(value);
                          setIsUserChanged(true);
                        }}
                        showSearch={true}
                        className="suffix-icon h-11 !rounded"
                        placeholder="Chọn loại khuyến mại"
                      />
                      <InputError error={errors.type?.message} />
                    </div>
                  )}
                />
              </div>
              {voucherType !== "FREEITEM" && (
                <div>
                  <Label infoText="" label={t("value")} required />
                  <Controller
                    name="discountValue"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <CustomInput
                          {...field}
                          type="number"
                          placeholder={
                            voucherType === "PERCENT" ? "0 %" : "0 ₫"
                          }
                          className="w-[100%] h-[44px] flex-1"
                        />
                        <InputError error={errors.discountValue?.message} />
                      </div>
                    )}
                  />
                </div>
              )}
              <div>
                <Label infoText="" label={t("minimumInvoiceValue")} />
                <Controller
                  name="minBillValue"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <CustomInput
                        {...field}
                        type="number"
                        placeholder="0 ₫"
                        className="w-[100%] h-[44px] flex-1"
                      />
                    </div>
                  )}
                />
              </div>
              {voucherType === "PERCENT" && (
                <div>
                  <Label infoText="" label={t("maxDiscount")} />
                  <Controller
                    name="maxDiscount"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <CustomInput
                          {...field}
                          type="number"
                          placeholder="0 ₫"
                          className="w-[100%] h-[44px] flex-1"
                        />
                      </div>
                    )}
                  />
                </div>
              )}
              {voucherType === "FREEITEM" && (
                <div>
                  <Label infoText="" label="Số lượng quà tặng tối đa" />
                  <Controller
                    name="maxQuantityGift"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <CustomInput
                          {...field}
                          type="text"
                          className="w-[100%] h-[44px] flex-1"
                        />
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              {voucherType === "FREEITEM" && (
                <div>
                  <Label infoText="" label="Quà tặng" />
                  <div
                    className="mb-2"
                    onClick={() => setOpenModalFreeItem(true)}
                  >
                    <div
                      onClick={(e) => e.preventDefault()}
                      className="flex p-3 justify-between border rounded-md cursor-pointer"
                    >
                      <p>Chọn mặt hàng </p>
                      <Image src={SortingIcon} />
                    </div>
                  </div>
                  <div className="overflow-y-auto">
                    <Table
                      dataSource={freeItem}
                      columns={[
                        {
                          title: "STT",
                          dataIndex: "variantId",
                          render: (_, __, index) => index + 1,
                          width: 50,
                        },
                        {
                          title: "Hình ảnh",
                          dataIndex: "avatarUrl",
                          render: (avatarUrl: string | null, _) => {
                            if (!avatarUrl) {
                              return (
                                <div className="w-[60px] h-[60px] rounded-md flex items-center justify-start text-gray-400 text-xs"></div>
                              );
                            } else if (avatarUrl.startsWith("#")) {
                              return (
                                <div
                                  className="w-[60px] h-[60px] rounded-md"
                                  style={{ backgroundColor: avatarUrl }}
                                />
                              );
                            } else {
                              return (
                                <Image
                                  src={avatarUrl}
                                  alt="Product Image"
                                  width={60}
                                  height={60}
                                />
                              );
                            }
                          },
                        },
                        {
                          title: "Tên mặt hàng",
                          dataIndex: "name",
                          render: (_: any, record: any) => {
                            const displayName = record?.productName
                              ? `${record.productName} (${record.name})`
                              : record.name;
                            return <span>{displayName}</span>;
                          },
                        },
                        {
                          title: "Hành động",
                          dataIndex: "variantId",
                          render: (variantId: number) => (
                            <Button
                              type="link"
                              icon={<Image src={XIcon} alt="Delete Icon" />}
                              onClick={() => {
                                const filtered = freeItem.filter(
                                  (v) => v.variantId !== variantId
                                );
                                setFreeItem(filtered);
                                const freeItemIds = filtered.map(
                                  (item) => item.variantId
                                );
                                setValue("freeItems", freeItemIds);
                              }}
                            />
                          ),
                        },
                      ]}
                      pagination={false}
                      rowKey="variantId"
                    />
                  </div>
                </div>
              )}
            </div>
            <Divider className="md:col-span-2 bg-[#E5E5E5] h-[1px] my-[10px]" />
            {voucherType !== "FREEITEM" && (
              <div>
                <div className="flex justify-between">
                  <h1 className="text-[#1a1a1a] font-semibold ">
                    {t("autoApply")}
                  </h1>
                  <Controller
                    name="isAutoApply"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-1">
                        <CustomSwitch {...field} />
                      </div>
                    )}
                  />
                </div>
                <InputError error={errors.isAutoApply?.message} />
              </div>
            )}
            {voucherType === "FREEITEM" && (
              <div>
                <div className="flex justify-between">
                  <h1 className="text-[#1a1a1a] font-semibold ">
                    Áp dụng chương trình khuyến mại khi mua một món
                  </h1>
                  <Controller
                    name="isApplyItem"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-1">
                        <CustomSwitch {...field} />
                      </div>
                    )}
                  />
                </div>
                <InputError error={errors.isApplyItem?.message} />
              </div>
            )}
          </div>
          <div className="card my-5">
            <Label infoText="" label={t("applyWith")} />
            <Controller
              name="applyType"
              control={control}
              render={({ field }) => (
                <div className="mb-3">
                  <CustomRadio
                    {...field}
                    options={filteredRadioType}
                    direction="vertical"
                    gap={2}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <InputError error={errors.applyType?.message} />

            {applyType === "CATEGORY" && (
              <div>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <CustomSelect
                        {...field}
                        mode="tags"
                        options={categories?.data?.content?.map((item) => ({
                          label: item.name,
                          value: item.id,
                          name: item.name,
                        }))}
                        onChange={(value) => {
                          field.onChange(value);
                          setValue("categories", value);
                        }}
                        showSearch
                        className="suffix-icon h-11 !rounded multiple"
                        placeholder="Tìm kiếm danh mục"
                      />
                      <InputError error={errors.categories?.message} />
                    </div>
                  )}
                />

                <div>
                  <Table
                    dataSource={(watch("categories") || []).map((id) => {
                      const category = categories?.data?.content?.find(
                        (item) => item.id === id
                      );
                      return {
                        key: id,
                        id,
                        name: category?.name,
                      };
                    })}
                    columns={[
                      {
                        title: "STT",
                        dataIndex: "key",
                        render: (_, __, index) => index + 1,
                        width: 50,
                      },
                      {
                        title: "Tên danh mục",
                        dataIndex: "name",
                      },

                      {
                        title: "Hành động",
                        dataIndex: "id",
                        render: (id) => (
                          <Button
                            type="link"
                            icon={<Image src={XIcon} alt="Delete Icon" />}
                            onClick={() => {
                              const newCategories = watch("categories").filter(
                                (item) => item !== id
                              );
                              setValue("categories", newCategories);
                            }}
                          />
                        ),
                        width: 100,
                      },
                    ]}
                    pagination={false}
                    rowKey="id"
                  />
                </div>
              </div>
            )}

            {applyType === "ITEM" && (
              <div>
                <div className="mb-2" onClick={() => setOpenModal(true)}>
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="flex p-3 justify-between border rounded-md cursor-pointer"
                  >
                    <p>Chọn mặt hàng </p>
                    <Image src={SortingIcon} />
                  </div>
                </div>
                <div className="overflow-y-auto">
                  <Table
                    dataSource={variants}
                    columns={[
                      {
                        title: "STT",
                        dataIndex: "variantId",
                        render: (_, __, index) => index + 1,
                        width: 50,
                      },
                      {
                        title: "Hình ảnh",
                        dataIndex: "avatarUrl",
                        render: (avatarUrl: string | null, _) => {
                          if (!avatarUrl) {
                            return (
                              <div className="w-[60px] h-[60px] rounded-md flex items-center justify-start text-gray-400 text-xs"></div>
                            );
                          } else if (avatarUrl.startsWith("#")) {
                            return (
                              <div
                                className="w-[60px] h-[60px] rounded-md"
                                style={{ backgroundColor: avatarUrl }}
                              />
                            );
                          } else {
                            return (
                              <Image
                                src={avatarUrl}
                                alt="Product Image"
                                width={60}
                                height={60}
                              />
                            );
                          }
                        },
                      },
                      {
                        title: "Tên mặt hàng",
                        dataIndex: "name",
                        render: (_: any, record: any) => {
                          const displayName = record?.productName
                            ? `${record.productName} (${record.name})`
                            : record.name;
                          return <span>{displayName}</span>;
                        },
                      },
                      {
                        title: "Giá bán",
                        dataIndex: "price",
                        render: (price: number) => formatMoney(price),
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        align: "center",
                        render: (quantity: number, record: Variant) => (
                          <div className="flex items-center justify-center gap-[10px]">
                            <button
                              className="border-[#E50000] text-[22px] text-[#E50000] rounded-full border-[1px] w-[32px] h-[32px] flex justify-center items-center"
                              onClick={() => {
                                const updated = variants.map((v) =>
                                  v.variantId === record.variantId
                                    ? {
                                        ...v,
                                        quantity: Math.max(v.quantity - 1, 1),
                                      }
                                    : v
                                );
                                setVariants(updated);
                                setValue("variants", updated);
                              }}
                            >
                              -
                            </button>
                            <InputNumber
                              min={1}
                              className="text-[22px] font-bold flex justify-center"
                              value={quantity}
                              onChange={(value) => {
                                const updated = variants.map((v) =>
                                  v.variantId === record.variantId
                                    ? { ...v, quantity: value || 1 }
                                    : v
                                );
                                setVariants(updated);
                                setValue("variants", updated);
                              }}
                            />
                            <button
                              className="border-[#3355FF] text-[#3355FF] text-[22px] rounded-full border-[1px] w-[32px] h-[32px] flex justify-center items-center"
                              onClick={() => {
                                const updated = variants.map((v) =>
                                  v.variantId === record.variantId
                                    ? { ...v, quantity: v.quantity + 1 }
                                    : v
                                );
                                setVariants(updated);
                                setValue("variants", updated);
                              }}
                            >
                              +
                            </button>
                          </div>
                        ),
                      },
                      {
                        title: "Hành động",
                        dataIndex: "variantId",
                        render: (variantId: number) => (
                          <Button
                            type="link"
                            icon={<Image src={XIcon} alt="Delete Icon" />}
                            onClick={() => {
                              const filtered = variants.filter(
                                (v) => v.variantId !== variantId
                              );
                              setVariants(filtered);
                              setValue("variants", filtered);
                            }}
                          />
                        ),
                      },
                    ]}
                    pagination={false}
                    rowKey="variantId"
                  />
                </div>
              </div>
            )}
          </div>

          {(applyType === "ITEM" || applyType === "CATEGORY") && (
            <div className="card mb-10">
              <div className="flex justify-between">
                <Label
                  infoText=""
                  label="Không áp dụng giảm giá cho nhóm lựa chọn trong mặt hàng"
                />
                <Controller
                  name="isNoApplySelection"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-1">
                      <CustomSwitch {...field} />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
          {/* 3 */}
          <div className="card mb-10">
            <h1 className="text-[#1a1a1a] font-semibold text-[20px] uppercase">
              {t("effectiveDate")}
            </h1>
            <div className="flex flex-col gap-[20px] py-4">
              <div>
                <Label
                  infoText=""
                  label={t("startDate")}
                  className="font-normal"
                  required
                />
                <Controller
                  name="startDay"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      {...field}
                      onChange={(date) => field.onChange(date)}
                      bordered={true}
                      picker="datetime"
                      format="yyyy-mm-dd hh:mm"
                    />
                  )}
                />
                <InputError error={errors.startDay?.message} />
              </div>
              <Flex justify="flex" className="col-span-2  my-1">
                <CustomCheckbox
                  checked={showEndDate}
                  onChange={handleCheckboxChange}
                />
                <div className="ml-2">
                  <h1> Thời gian kết thúc </h1>
                </div>
              </Flex>

              {showEndDate && (
                <div>
                  <Label
                    infoText=""
                    label={t("endDate")}
                    className="font-normal"
                  />
                  <Controller
                    name="endDay"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker
                        {...field}
                        onChange={(date) => field.onChange(date)}
                        bordered={true}
                        picker="datetime"
                        format="yyyy-mm-dd hh:mm"
                      />
                    )}
                  />
                  <InputError error={errors.endDay?.message} />
                </div>
              )}
            </div>
            <Divider className="md:col-span-2 bg-[#E5E5E5] h-[1px] my-[10px]" />
            <div className="py-2">
              <div className="flex justify-between">
                <h1 className="text-[#1a1a1a] font-semibold ">
                  {t("applyByDay")}
                </h1>
                <Controller
                  name="isDayOfWeek"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-1">
                      <CustomSwitch {...field} />
                    </div>
                  )}
                />
              </div>
              <InputError error={errors.isDayOfWeek?.message} />

              {isDayOfWeekEnabled && (
                <div className="my-3 flex justify-between space-x-2">
                  {daysOfWeek.map(({ label, value }) => (
                    <div
                      key={value}
                      className={`border-[1px] px-4 py-2 rounded-md border-gray-300 flex-1 text-center cursor-pointer ${
                        selectedDays.includes(value)
                          ? "bg-[#FF5C00] border-[1px] text-[#fff]"
                          : ""
                      }`}
                      onClick={() => handleDaySelection(value)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Divider className="md:col-span-2 bg-[#E5E5E5] h-[1px] my-[10px]" />
            <div className="py-2">
              <div className="flex justify-between">
                <h1 className="text-[#1a1a1a] font-semibold ">
                  {t("applyByTime")}
                </h1>

                <Controller
                  name="isHaveTimeSlot"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-1">
                      <CustomSwitch {...field} />
                    </div>
                  )}
                />
              </div>
              <InputError error={errors.isHaveTimeSlot?.message} />
              {isHaveTimeSlotEnabled && (
                <div>
                  {otherFields.map((selection, index) => (
                    <div className="flex gap-[25px] mb-3" key={selection.id}>
                      <div className="flex-1">
                        <Label infoText="" label="Từ" className="font-normal" />

                        <Controller
                          name={`timeSlot.${index}.startTime`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker
                              {...field}
                              onChange={(date) => {
                                const formattedDate = date
                                  ? dayjs(date, "HH:mm")
                                  : "Invalid Date";

                                field.onChange(formattedDate);
                              }}
                              bordered={true}
                              picker="time"
                              format="HH:mm"
                            />
                          )}
                        />

                        <InputError
                          error={errors?.timeSlot?.[index]?.startTime?.message}
                        />
                      </div>
                      <div className="flex-1">
                        <Label
                          infoText=""
                          label="Đến"
                          className="font-normal"
                        />
                        <Controller
                          name={`timeSlot.${index}.endTime`}
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker
                              {...field}
                              onChange={(date) => {
                                const formattedDate = date
                                  ? dayjs(date, "HH:mm")
                                  : "Invalid Date";
                                field.onChange(formattedDate);
                              }}
                              bordered={true}
                              picker="time"
                              format="HH:mm"
                            />
                          )}
                        />
                        <InputError
                          error={errors?.timeSlot?.[index]?.endTime?.message}
                        />
                      </div>
                      {otherFields.length > 1 && (
                        <div
                          className="p-1 flex items-center justify-center cursor-pointer"
                          onClick={() => removeFields(index)}
                        >
                          <Image src={XIcon} alt="Delete Icon" />
                        </div>
                      )}
                    </div>
                  ))}
                  <CustomButton
                    type="none"
                    className="!w-fit text-[#F38B25]"
                    prefixIcon={<Image src={PlusIcons} alt="Plus Icon" />}
                    onClick={addTimeSlot}
                  >
                    Thêm khung giờ
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col xs={24} sm={24} md={24} lg={9} xl={9}>
          <div className="card my-5">
            <Label infoText="" label={t("applicableTarget")} />
            <div className="mt-4">
              <Controller
                name="isAllCustomer"
                control={control}
                render={({ field }) => (
                  <div className="mb-1">
                    <CustomRadio
                      {...field}
                      options={radioCustomer}
                      direction="vertical"
                      gap={2}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
              <InputError error={errors.isAllCustomer?.message} />

              {!isAllCustomer && (
                <div>
                  <Controller
                    name="groupCustomer"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <CustomSelect
                          {...field}
                          mode="tags"
                          options={customers?.data?.content?.map((item) => ({
                            label: item.name,
                            value: item.id,
                            name: item.name,
                          }))}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue("groupCustomer", value);
                          }}
                          showSearch={true}
                          className="suffix-icon h-11 !rounded multiple"
                          placeholder="Tìm kiếm nhóm khách hàng"
                        />
                        <InputError error={errors.groupCustomer?.message} />
                      </div>
                    )}
                  />

                  <div>
                    {(watch("groupCustomer") || []).map((id, index) => {
                      const customer = customers?.data?.content?.find(
                        (item) => item.id === id
                      );
                      return (
                        <div
                          key={id}
                          className="flex justify-between my-2 cursor-pointer"
                        >
                          <span>
                            {index + 1}. {customer?.name}
                          </span>
                          <Image
                            src={XIcon}
                            alt="Delete Icon"
                            onClick={() => {
                              const newCustomer = watch("groupCustomer").filter(
                                (item) => item !== id
                              );
                              setValue("groupCustomer", newCustomer);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <CustomCardItem className="mb-4">
            <div className="p-6">
              <Label infoText="" label="Kênh bán hàng" />
              <div className="mt-4">
                <div className="mb-2">
                  <CustomCheckbox checked>
                    <strong className="font-light whitespace-nowrap">
                      Bán tại nhà hàng
                    </strong>
                  </CustomCheckbox>
                </div>
                <Controller
                  name="isOnlineChannel"
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
                        <strong className="font-light whitespace-nowrap">
                          Bán online
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
                <InputError error={errors.isOnlineChannel?.message} />{" "}
              </div>
            </div>
          </CustomCardItem>

          <div className="card mb-5">
            <div>
              <Label infoText="" label={t("menu")} />
              <Controller
                name="menu"
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
              <p className="mt-4 text-[#333]">
                Thêm Khuyến mại vào thực đơn để dễ dàng tìm kiếm khi bán hàng
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti?.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={handleDelete}
        />
      )}

      {modalChangeStatus.visible && (
        <ModalChangeStatus
          isVisible={modalChangeStatus.visible}
          setIsVisible={setmodalChangeStatus}
          title="Xác nhận thay đổi trạng thái"
          content={modalChangeStatus.content}
          type="success"
          onSubmit={handleConfirmChange}
        />
      )}

      {openModal && (
        <ModalProducts
          isOpen={openModal}
          onCancel={() => setOpenModal(false)}
          onAddVariants={handleAddVariants}
          selectedVariants={variants}
        />
      )}

      {openModalFreeItem && (
        <ModalFreeItems
          isOpen={openModalFreeItem}
          onCancel={() => setOpenModalFreeItem(false)}
          onAddVariants={handleAddFreeItem}
          selectedVariants={freeItem}
        />
      )}
    </>
  );
};

export default AddVoucher;

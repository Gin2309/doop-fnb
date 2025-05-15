import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import Label from "@/components/CustomLabel";
import Card from "../components/card/Card";
import Title from "@/components/Title";
import { Divider, message, Space, Table } from "antd";

import qr from "@/assets/images/qr2.png";
import Dowload from "@/assets/OrangeSimple.svg";
import { CustomButton } from "@/components/CustomButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  createPosition,
  getDetailPosition,
  updatePosition,
} from "@/api/config-position.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { getDetailArea } from "@/api/area.service";
import { schemaPosition } from "../schema/schema";
import TableVariant from "./TableVariant";
import CardDefault from "../components/card/CardDefault";
import VariantProductModal from "./VariantProductModal";

const tableGroup = [
  { label: "Ăn uống", value: "Ăn uống" },
  { label: "Karaoke", value: "Karaoke" },
  {
    label: "Nhà nghỉ, khách sạn",
    value: "Nhà nghỉ, khách sạn",
  },
  { label: "Ghế massage", value: "Ghế massage" },
  { label: "Bi a", value: "Bi-a" },
  { label: "Game", value: "Game" },
  { label: "Ghế làm việc", value: "Ghế làm việc" },
  { label: "Khác", value: "Khác" },
];

type Variant = {
  variantId: number;
  name: string;
  quantity: number;
  avatarUrl: string;
  price: number;
  productName: string;
};

const AddTable = ({ positionId }: { positionId?: string | number }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const [seenOption, setSeenOption] = useState("EXTEND");
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [variants, setVariants] = useState<Variant[]>([]);
  const handleQuantityChange = (newQuantities: { [key: number]: number }) => {
    setQuantities((prev) => ({
      ...prev,
      ...newQuantities,
    }));
  };

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
    setValue("defaultServices", mergedVariants);
  };

  const { data: PositionDetail } = useQuery(
    ["POS", positionId, branch?.id],
    () => getDetailPosition(Number(positionId), Number(branch?.id)),
    {
      enabled: !!positionId && !!branch?.id,
      onError: (error: any) => {
        message.error(
          "Lỗi khi lấy chi tiết vị trí",
          error.response?.data.message || error?.response?.message || error
        );
      },
    }
  );

  const { data: areaDetail } = useQuery(
    ["AREA", router.query?.areaId, branch?.id],
    () => getDetailArea(Number(router.query?.areaId), Number(branch?.id)),
    {
      enabled: !!router.query?.areaId && !!branch?.id,
      onError: (error: any) => {
        message.error(
          "Lỗi khi lấy chi tiết khu vực",
          error.response?.data.message || error?.response?.message || error
        );
      },
    }
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schemaPosition),
    mode: "onChange",
    defaultValues: {
      noteActive: true,
      lightActive: true,
      robotActive: true,
      staffNameActive: true,
      startTimeActive: true,
      customerNameActive: true,
      paidActive: true,
      defaultServices: [],
    },
  });

  useEffect(() => {
    if (PositionDetail?.data) {
      reset();
    }
  }, [PositionDetail, reset]);

  useEffect(() => {
    if (PositionDetail?.data) {
      const updatedVariants =
        PositionDetail?.data?.defaultService?.map((variant) => ({
          id: variant.id,
          variantId: variant?.variant?.id,
          name: variant?.variant?.name,
          avatarUrl: variant?.avatarUrl,
          price: variant?.variant?.price,
          unit: variant?.product?.unit,
          quantity: variant.quantity,
          productName: variant?.product?.name,
        })) || [];

      reset({
        ...PositionDetail.data,
        positionType: PositionDetail.data.type,
      });
      setValue("defaultServices", updatedVariants);
      setVariants(updatedVariants);
    }
  }, [PositionDetail, reset]);

  const { mutate: createPostionMutation, isLoading: loadingPostion } =
    useMutation(
      (data) => {
        const payload: any = data;

        return PositionDetail?.data
          ? updatePosition(PositionDetail?.data?.id, payload)
          : createPosition(payload);
      },
      {
        onSuccess: () => {
          if (!PositionDetail?.data) {
            message.success("Thêm mới thành công");
          } else {
            message.success("Cập nhật thành công");
          }
          queryClient.invalidateQueries(["AREA"]);
          queryClient.invalidateQueries(["POS"]);
          router.back();
          reset();
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message);
        },
      }
    );

  const onSubmit = () => {
    const data = getValues();
    const newDefaultServices = (data?.defaultServices || []).map((service) => {
      const newQuantity =
        quantities[service.id] !== undefined
          ? quantities[service.id]
          : service.quantity;

      return {
        id: service.id,
        variantId: service.variantId,
        quantity: newQuantity,
        delete: false,
      };
    });

    const submittedData = {
      ...data,
      branchId: branch?.id,
      areaId: PositionDetail?.data?.areaId || router.query?.areaId,
      defaultServices: newDefaultServices,
    };
    createPostionMutation(submittedData);
  };

  return (
    <>
      <div className="bg-white border-t-[1px] h-[72px] shadow-lg flex justify-between items-center px-[20px] overflow-hidden w-[calc(100% + 70px)] gap-[30px] mx-[-35px]">
        <div className="w-[70%] flex-1">
          <Title>{`Thêm vị trí vào khu vực ${
            PositionDetail?.data?.name || areaDetail?.data?.name
          }`}</Title>
        </div>

        <Space>
          <CustomButton
            type="original"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          <CustomButton
            type="primary"
            wrapClassName="min-w-[100px]"
            disabled={loadingPostion}
            onClick={handleSubmit(onSubmit)}
          >
            {PositionDetail?.data ? "Lưu" : "Thêm phòng/bàn"}
          </CustomButton>
        </Space>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 mt-7">
        <div className="card 2xs:col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 2xs:col-span-2 sm:col-span-1">
            <div>
              <Label infoText="" label="Tên vị trí" required />
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <CustomInput
                      {...field}
                      type="text"
                      placeholder="Nhập tên bàn"
                      className="w-[100%] h-[44px] flex-1"
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />
            </div>
            <div>
              <Label infoText="" label="Số thứ tự" required />
              <Controller
                name="orderNo"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <CustomInput
                      {...field}
                      type="text"
                      placeholder="Nhập số thứ tự"
                      className="w-[100%] h-[44px] flex-1"
                    />
                    <InputError error={errors.orderNo?.message} />
                  </div>
                )}
              />
            </div>
            <div>
              <Label infoText="" label="Loại phòng/bàn" required />
              <Controller
                name="positionType"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <CustomSelect
                      {...field}
                      options={tableGroup?.map((item) => ({
                        value: item.value,
                        label: t(item.label),
                      }))}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                    />
                    <InputError error={errors.positionType?.message} />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="2xs:col-span-2 sm:col-span-1">
            <Label infoText="" label={t("qrcodeOrder")} />
            <h1 className="italic text-[#666666] text-[14px]">
              {t("autoGeneratedCode")}
            </h1>
            <div className="flex gap-5 items-center">
              <div>
                <Image src={qr} height={200} width={200} />
              </div>
              <div className="bg-[#FFF2E4] rounded-xl p-4 cursor-pointer">
                <Image src={Dowload} height={32} width={32} />
              </div>
            </div>
          </div>

          <div className="2xs:col-span-2 sm:col-span-1">
            <Label infoText="" label="Các thuộc tính hiển thị khác:" />
            <div className="flex flex-wrap gap-x-[60px] gap-y-[20px]">
              <div className="w-1/4">
                <Controller
                  name="lightActive"
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
                          Đèn tín hiệu
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>
              <div className="w-1/2">
                <Controller
                  name="noteActive"
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
                          Ghi chú
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>
              <div className="w-1/4">
                <Controller
                  name="robotActive"
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
                          Robot quan
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>

              <div className="w-1/2">
                <Controller
                  name="staffNameActive"
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
                          Tên nhân viên phục vụ
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>
              <div className="w-1/4">
                <Controller
                  name="customerNameActive"
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
                          Tên khách hàng
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>
              <div className="w-1/2">
                <Controller
                  name="startTimeActive"
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
                          Thời gian vào
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>

              <div className="w-1/2">
                <Controller
                  name="paidActive"
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
                          Thu tiền trước
                        </strong>
                      </CustomCheckbox>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Divider />
          </div>

          <div className="col-span-2">
            <Label infoText="" label={t("defaultServiceItem")} />
            <TableVariant
              dataSource={variants}
              onQuantityChange={handleQuantityChange}
              handleDeleteRow={(rowId) => {
                setVariants((prev) => prev.filter((v) => v.variantId !== rowId));
              }}
            />
          </div>

          <div className="2xs:col-span-1 md:col-span-2 bg-[#fff8f8] p-3 rounded-xl">
            <CustomButton
              type="primary"
              wrapClassName="w-[146px]"
              onClick={() => {
                setOpen(true);
              }}
            >
              {t("addItem")}
            </CustomButton>
          </div>
        </div>

        <div>
          <div className="card gap-4 flex flex-col ">
            <div className="mb-3">
              <div>
                <Label infoText="" label={t("viewMode")} />
                <CustomSelect
                  onChange={(value) => setSeenOption(value)}
                  options={[
                    { label: "Trực quan", value: "EXTEND" },
                    { label: "Thu nhỏ", value: "MINIMIZE" },
                  ]}
                  showSearch={true}
                  value={seenOption}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Chọn chế độ xem"
                />
              </div>
              <div className="flex flex-nowrap gap-[10px] mt-2">
                <CardDefault
                  seenOption={seenOption}
                  data={PositionDetail?.data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <VariantProductModal
        isOpen={open}
        onCancel={() => {
          setOpen(false);
        }}
        onAddVariants={handleAddVariants}
        selectedVariants={variants}
      />
    </>
  );
};

export default AddTable;

import { createCategory } from "@/api/category.service";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { branchStateSession, provinceState } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "@/components/InputError";

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomActionHeader from "@/components/CustomActionHeader";

import {
  createCustomer,
  getDetailCustomer,
  getDistrict,
  updateCustomer,
} from "@/api/customer.service";
import schema from "../../add/schema";
import { useEffect, useState } from "react";

const genderGroup = {
  data: {
    items: [
      { id: "MALE", name: "Nam" },
      { id: "FEMALE", name: "Nữ" },
    ],
  },
};

const ModalCustomer = ({
  isOpen,
  onCancel,
  formUpdateCurrentBill,
  setFormUpdateCurrentBill,
  edit,
}: {
  isOpen: boolean;
  onCancel: () => void;
  formUpdateCurrentBill: any;
  setFormUpdateCurrentBill: any;
  edit: any;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const province = useRecoilValue(provinceState);
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ["CUSTOMER_DETAIL", formUpdateCurrentBill?.customerId, branchId],
    () =>
      getDetailCustomer(branchId, Number(formUpdateCurrentBill?.customerId)),
    {
      enabled: !!formUpdateCurrentBill?.customerId && !!branch.id && !!edit,
    }
  );
  const useDetail = data?.data;

  const {
    getValues,
    setValue,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (useDetail && edit) {
      reset({
        id: useDetail?.id || "",
        name: useDetail?.name || "",
        phone: useDetail?.phone || "",
        email: useDetail?.email || "",
        dob: useDetail?.dob || null,
        gender: useDetail?.gender || null,
        provinceCode: useDetail?.provinceCode || null,
        districtCode: useDetail?.districtCode || null,
        address: useDetail?.address || null,
        note: useDetail?.note || null,
        isVatBill: useDetail?.isVatBill || false,
        isAutoVatBill: useDetail?.isAutoVatBill || false,
        vatTaxCode: useDetail?.vatTaxCode || null,
        vatEmail: useDetail?.vatEmail || null,
        vatPhone: useDetail?.vatPhone || "",
        vatName: useDetail?.vatName || null,
        vatNote: useDetail?.vatNote || null,
        vatAddress: useDetail?.vatAddress || null,
        vatCompany: useDetail?.vatCompany || null,
        code: useDetail?.code || "",
      });
    }
  }, [useDetail, reset]);

  const [isChecked, setIsChecked] = useState(getValues("isVatBill") ?? false);

  const { mutate: createCustomerMutation, isLoading } = useMutation(
    (data: any) => {
      return !!formUpdateCurrentBill?.customerId && edit
        ? updateCustomer(data, data?.id)
        : createCustomer(data);
    },
    {
      onSuccess: async (data) => {
        message.success(
          router.query.id === "add"
            ? "Thêm khách hàng thành công!"
            : "Cập nhật khách hàng thành công"
        );
        await queryClient.invalidateQueries(["CUSTOMER"]);
        setFormUpdateCurrentBill({
          ...formUpdateCurrentBill,
          customerId: data?.data?.id,
        });
        onCancel();
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
    };

    createCustomerMutation(submittedData);
  };

  const provinceCode = watch("provinceCode");

  const { data: district } = useQuery(["DISTRICT", provinceCode], () =>
    getDistrict(provinceCode)
  );

  const handleCancel = () => {
    reset({
      name: "",
      phone: "",
      email: "",
      dob: null,
      gender: null,
      provinceCode: null,
      districtCode: null,
      address: null,
      note: null,
      isVatBill: false,
      isAutoVatBill: false,
      vatTaxCode: null,
      vatEmail: null,
      vatPhone: "",
      vatName: null,
      vatNote: null,
      vatAddress: null,
      vatCompany: null,
      code: "",
    });
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={handleCancel}
      title={
        !!formUpdateCurrentBill?.customerId && edit
          ? useDetail?.name
          : "Thêm mới khách hàng"
      }
      width={1000}
      onSubmit={handleSubmit(onSubmit)}
      textOk="Lưu"
    >
      <div className="my-6 grid 2xs:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("customerCode")} />
              <CustomInput
                className={`suffix-icon h-11 !rounded`}
                placeholder="Mã khách hàng tự động"
                onChange={onChange}
                value={value}
              />
              <InputError error={errors.code?.message} />
            </div>
          )}
        />

        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("customerFullName")} required />
              <CustomInput
                className={`suffix-icon h-11 !rounded`}
                placeholder="Nhập họ và tên khách hàng"
                onChange={onChange}
                value={value}
              />
              <InputError error={errors.name?.message} />
            </div>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("email")} />
              <CustomInput
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập email của nhân viên"
                onChange={onChange}
                value={value ?? ""}
              />
              <InputError error={errors.email?.message} />
            </div>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("phoneNumber")} required />
              <CustomInput
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập số điện thoại khách hàng"
                onChange={onChange}
                value={value}
              />
              <InputError error={errors.phone?.message} />
            </div>
          )}
        />

        <Controller
          name="dob"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <Label infoText="" label={t("dateOfBirth")} />
                <CustomDatePicker
                  onChange={onChange}
                  bordered={true}
                  picker="date"
                  value={value ?? null}
                />
                <InputError error={errors.dob?.message} />
              </div>
            );
          }}
        />

        <Controller
          name="gender"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <Label infoText="" label={t("gender")} />
                <CustomSelect
                  options={genderGroup?.data?.items?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  showSearch={true}
                  onChange={onChange}
                  value={value}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Chọn giới tính"
                />
                <InputError error={errors.gender?.message} />
              </div>
            );
          }}
        />

        <div className="col-span-2 border-[1px] border-[#E5E5E5]"></div>

        <Controller
          name="provinceCode"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <Label infoText="" label={t("provinceOrCity")} />
                <CustomSelect
                  options={province?.map((item: any) => ({
                    value: item.code,
                    label: item.name,
                  }))}
                  onChange={onChange}
                  showSearch
                  value={value}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Chọn tỉnh/thành phố"
                />
                <InputError error={errors.provinceCode?.message} />
              </div>
            );
          }}
        />

        <Controller
          name="districtCode"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <div>
                <Label infoText="" label={t("districtOrTown")} />
                <CustomSelect
                  options={
                    district?.data?.length > 0
                      ? district?.data?.map((item: any) => ({
                          value: item.code,
                          label: item.name,
                        }))
                      : [
                          {
                            value: "",
                            label: "Vui lòng chọn Tỉnh/Thành phố",
                            disabled: true,
                          },
                        ]
                  }
                  onChange={onChange}
                  showSearch
                  value={value}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Chọn quận/huyện"
                />
                <InputError error={errors.districtCode?.message} />
              </div>
            );
          }}
        />

        <Controller
          name="address"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("specificAddress")} />
              <CustomInput
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập địa chỉ cụ thể"
                onChange={onChange}
                value={value ?? ""}
              />
              <InputError error={errors.address?.message} />
            </div>
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label infoText="" label={t("note")} />
              <CustomInput
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập ghi chú"
                onChange={onChange}
                value={value ?? ""}
              />
              <InputError error={errors.note?.message} />
            </div>
          )}
        />
      </div>
    </CustomModal>
  );
};

export default ModalCustomer;

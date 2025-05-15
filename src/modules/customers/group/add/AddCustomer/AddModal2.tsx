import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { ColumnType } from "antd/es/table";
import CloseCircleGrayIcon from "@/assets/close.svg";
import Label from "@/components/CustomLabel";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomSelect } from "@/components/CustomSelect";

import { useRecoilValue } from "recoil";
import { provinceState } from "@/recoil/state";

import { addToGroup } from "@/api/customer-group.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import schema from "./schema";
import { createCustomer, getDistrict } from "@/api/customer.service";
import { message } from "antd";

const genderGroup = {
  data: {
    items: [
      { id: "MALE", name: "Nam" },
      { id: "FEMALE", name: "Nữ" },
    ],
  },
};

const AddModal2 = ({
  isOpen,
  onCancel,
  branchId,
  onUserSelection,
}: {
  isOpen: boolean;
  onCancel: () => void;
  branchId: number;
  onUserSelection: any;
}) => {
  const { t } = useTranslation();
  const province = useRecoilValue(provinceState);

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

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const { mutate: createCustomerMutation, isLoading: isCreating } = useMutation(
    (data: any) => createCustomer(data),
    {
      onSuccess: (response) => {
        const user = response.data;

        if (user) {
          onUserSelection([user]);
          handleCancel();
          reset();
        }
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

  const [isChecked, setIsChecked] = useState(getValues("isVatBill") ?? false);

  const handleCheckboxChange = (value) => {
    setIsChecked(value.target.checked);
  };

  useEffect(() => {
    if (!isChecked) {
      reset({
        isAutoVatBill: false,
        vatTaxCode: "",
        vatEmail: "",
        vatPhone: "",
        vatName: "",
        vatNote: "",
        vatAddress: "",
        vatCompany: "",
      });
    }
  }, [isChecked, setValue]);

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      customFooter
      title={t("addCustomerToGroup")}
      width={1000}
    >
      <div>
        <div>
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] mb-6">
            {t("customerInformation")}
          </h1>
          <div className="grid grid-cols-2 gap-6 mb-6">
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
        </div>
        <div className="mb-6">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] mb-6">
            {t("vatInvoiceInfo")}
          </h1>

          <div className="gap-4 grid 2xs:grid-cols-1 md:grid-cols-2">
            <Controller
              name="isVatBill"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="2xs:col-span-1 md:col-span-2">
                  <CustomCheckbox
                    checked={isChecked}
                    onChange={(e) => {
                      onChange(e);
                      handleCheckboxChange(e);
                    }}
                  />
                  <span className="ml-2">{t("vatInvoice")}</span>
                </div>
              )}
            />

            {isChecked && (
              <>
                <Controller
                  name="isAutoVatBill"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="2xs:col-span-1 md:col-span-2">
                      <CustomCheckbox
                        checked={value ?? false}
                        onChange={onChange}
                      />
                      <span className="ml-2">{t("autoVatRequest")}</span>
                    </div>
                  )}
                />

                <Controller
                  name="vatTaxCode"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("taxCode")} required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập mã mã số thuế"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatTaxCode?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatCompany"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("vatCompany")} required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập tên công ty/đơn vị"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatCompany?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatAddress"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("address")} required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập địa chỉ cụ thể"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatAddress?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatNote"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("note")} />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập ghi chú"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatNote?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatEmail"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="2xs:col-span-1 md:col-span-2">
                      <Label
                        infoText=""
                        label={t("vatInvoiceEmail")}
                        required
                      />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập email"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatEmail?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatPhone"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("phoneNumber")} />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập số điện thoại"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatPhone?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="vatName"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div>
                      <Label infoText="" label={t("buyerName")} />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập họ tên khách hàng"
                        onChange={onChange}
                        value={value ?? ""}
                      />
                      <InputError error={errors.vatName?.message} />
                    </div>
                  )}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
        <CustomButton
          outline={true}
          className="!h-11 !w-[120px]"
          type="original"
          onClick={handleCancel}
        >
          {t("cancel")}
        </CustomButton>
        <CustomButton
          isLoading={isCreating}
          className="!h-11 !w-[120px]"
          onClick={handleSubmit(onSubmit)}
          type="primary"
        >
          {t("add")}
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default AddModal2;

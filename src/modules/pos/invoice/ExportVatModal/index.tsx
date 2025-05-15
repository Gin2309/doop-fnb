import React from "react";
import { useTranslation } from "react-i18next";

import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomButton } from "@/components/CustomButton";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";
import schema from "./schema";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";

const ExportVatModal = ({ isOpen, onClose, Id, setId }) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    onClose();
    setId(null);
  };

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

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={handleCancel}
      customFooter
      title="Xác nhận thông tin xuất hóa đơn VAT"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="border-[1px] border-[#E5E5E5] rounded-lg p-5">
          <h1 className="text-[#1A1A1A] font-semibold mb-2">
            Bạn có muốn xuất hóa đơn VAT ngay
          </h1>

          <CustomRadio
            onChange={(e) => {}}
            options={[
              { value: "Xuất hóa đơn sau", label: "Xuất hóa đơn sau" },
              { value: "Xuất hóa đơn ngay", label: "Xuất hóa đơn ngay" },
            ]}
            gap={4}
          />
        </div>
        <div className="border-[1px] border-[#E5E5E5] rounded-lg p-5">
          <h1 className="text-[#1A1A1A] font-semibold mb-2">
            Xuất cho đối tượng
          </h1>
          <CustomRadio
            onChange={(e) => {}}
            options={[
              { value: "Đơn vị/tổ chức", label: "Đơn vị/tổ chức" },
              { value: "Cá nhân", label: "Cá nhân" },
            ]}
          />
        </div>

        <div className="bg-[#F9FAFF] rounded-lg p-4 col-span-2">
          <h1 className="text-[#1A1A1A] font-semibold uppercase text-[18px] mb-5">
            {t("customerInformation")}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6 ">
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
                  <Label infoText="" label={t("vatInvoiceEmail")} required />
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
                  <Label infoText="" label={t("phoneNumber")} required />
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
                  <Label infoText="" label={t("buyerName")} required />
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
          isLoading={false}
          className="!h-11 !w-[120px]"
          onClick={() => {}}
          type="primary"
        >
          {t("exportInvoice")}
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default ExportVatModal;

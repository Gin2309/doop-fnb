import { Col, message, Modal, Row } from "antd";
import Image from "next/image";
import BlockAuth from "@/assets/images/block.png";
import styled from "styled-components";
import { CustomModal } from "@/components/CustomModal";
import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import NormalUpload from "@/components/CustomUpload/NormalUpload";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaBranchChain } from "./schema/schema";
import InputError from "@/components/InputError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SortingIcon from "@/assets/column-sorting.svg";
import { createBranchChain } from "@/api/branch-chain.service";
import { CustomSelect } from "@/components/CustomSelect";
import { useState } from "react";
import CustomUpload from "@/components/CustomUpload";

const FormBranchChain = ({
  isOpen,
  onCancel,
  setValueChain,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setValueChain?: any;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [businessValue, setBusinessValue] = useState("");
  const [optionBusiness, setOptionBusiness] = useState([
    { value: "Cafe, Nhà hàng", label: "Cafe, Nhà hàng" },
    { value: "Trà sữa", label: "Trà sữa" },
    { value: "Spa, Massage", label: "Spa, Massage" },
    { value: "Nhà nghỉ, Khách sạn", label: "Nhà nghỉ, Khách sạn" },
    { value: "Khác", label: "Khác" },
  ]);

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaBranchChain),
    mode: "onChange",
  });

  const { mutate: mutate } = useMutation((data) => createBranchChain(data), {
    onSuccess: async (response) => {
      await queryClient.invalidateQueries(["BRANCH_CHAIN"]);
      if (setValueChain) {
        setValueChain("branchChainId", response.data.id);
      }
      message.success("Tạo chuỗi chi nhánh thành công");
      reset();
      onCancel();
    },
    onError(err: any) {
      const errorMessage =
        err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      customFooter
      title={t("addNewBranchGroup")}
      width={800}
    >
      <div>
        <Row gutter={[15, 15]}>
          <Col xs={5}>
            <CustomUpload
              type="type-1"
              className="!min-h-[350px]"
              value={getValues("logo")}
              onChangeValue={(url) => setValue("logo", url)}
            />
          </Col>
          <Col xs={19}>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mb-6">
              <div className="col-span-2">
                <Controller
                  name="businessModel"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label infoText="" label="Mô hình kinh doanh" />
                      <CustomSelect
                        {...field}
                        placeholder="Chọn mô hình kinh doanh"
                        options={
                          businessValue
                            ? [
                                ...optionBusiness,
                                {
                                  value: businessValue,
                                  label: businessValue,
                                },
                              ]
                            : optionBusiness
                        }
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <CustomInput
                              className="!border-[#F38820] m-2 p-2"
                              placeholder="Nhập mô hình kinh doanh của bạn"
                              value={businessValue}
                              onChange={(e) => {
                                setBusinessValue(e);
                                setValue("businessModel", e);
                              }}
                            />
                          </div>
                        )}
                        showSearch={true}
                        className="suffix-icon h-11 !rounded"
                      />
                    </div>
                  )}
                />
              </div>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <Label
                      infoText=""
                      label="Tên thương hiệu/ tên chuỗi"
                      required
                    />
                    <CustomInput
                      {...field}
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập tên"
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />

              <Controller
                name="slogan"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <Label infoText="" label="Slogan" />
                    <CustomInput
                      {...field}
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập slogan"
                    />
                    <InputError error={errors.slogan?.message} />
                  </div>
                )}
              />
            </div>
          </Col>
        </Row>

        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            type="original"
            onClick={onCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            // disabled={isLoading}
            className="!h-11 !w-[120px]"
            onClick={handleSubmit(onSubmit)}
            type="primary"
          >
            {t("save")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default FormBranchChain;

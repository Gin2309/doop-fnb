import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Button, Col, message, Row, Space } from "antd";
import { CustomCardContent } from "@/components/CustomCardContent";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";

import { CustomButton } from "@/components/CustomButton";

import SortingIcon from "@/assets/column-sorting.svg";
import PlusCircle from "@/assets/PlusCircle.svg";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import { CustomRadio } from "@/components/CustomRadio";
import NormalUpload from "@/components/CustomUpload/NormalUpload";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../../modules/home/schema/schema";
import InputError from "@/components/InputError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBranch,
  deleteBranch,
  getDetailBranch,
  registerTrial,
  updateBranch,
} from "@/api/branch.service";

import { useEffect, useState } from "react";
import FormBranchChain from "@/modules/home/FormBranchChain";
import { getBranchChain } from "@/api/branch-chain.service";
import AddEmployee from "@/modules/employees/list/components/AddEmployee";
import CustomColorPicker from "@/components/CustomColorPicker";
import { isColorAvatar } from "@/utils";
import CustomUpload from "@/components/CustomUpload";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";

export default function FormBranch() {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showSuccessNoti, setShowSuccessNoti] = useState({
    visible: false,
    content: "",
  });
  const [showErrorNoti, setShowErrorNoti] = useState({
    visible: false,
    content: "",
  });
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });
  const [openFormBranchChain, setOpenFormBranchChain] = useState(false);
  const [branchFetch, setBranchFetch] = useState(null);
  const [isOpenAddEmployee, setIsOpenAddEmployee] = useState(false);
  const [businessValue, setBusinessValue] = useState("");
  const [optionBusiness, setOptionBusiness] = useState([
    { value: "Cafe, Nhà hàng", label: "Cafe, Nhà hàng" },
    { value: "Trà sữa", label: "Trà sữa" },
    { value: "Spa, Massage", label: "Spa, Massage" },
    { value: "Nhà nghỉ, Khách sạn", label: "Nhà nghỉ, Khách sạn" },
    { value: "Khác", label: "Khác" },
  ]);
  const [avatarOption, setAvatarOption] = useState("picture");
  const [requiredVat, setRequiredVat] = useState(false);
  const [branchIdMutate, setBranchIdMutate] = useState(null);

  const { data: branchChains } = useQuery(["BRANCH_CHAIN"], () =>
    getBranchChain({
      limit: 99999,
      page: 1,
    })
  );

  const { data: branchDetail } = useQuery(
    ["BRANCH_DETAIL", router.query.id],
    () => getDetailBranch(Number(router.query.id)),
    { enabled: Boolean(router.query.id && router.query.id !== "add") }
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      return router.query.id === "add"
        ? createBranch(data)
        : updateBranch(Number(router.query.id), data);
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(["BRANCH"]);
        setBranchFetch(response?.data);
        setShowSuccessNoti({
          visible: true,
          content: "Bắt đầu bổ sung nhân viên để vận hành chi nhánh",
        });
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        setShowErrorNoti({
          visible: true,
          content: errorMessage,
        });
      },
    }
  );

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteBranch(Number(router.query.id));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["BRANCH"]);
        router.back();
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = (data) => {
    mutate(data);
  };

  const handleDelete = () => {
    mutateDelete();
  };

  useEffect(() => {
    if (branchDetail?.data) {
      if (isColorAvatar(branchDetail?.data?.avatarUrl)) {
        setAvatarOption("color");
      }
      reset(branchDetail?.data);
      setValue("branchChainId", branchDetail?.data?.branchChain?.id);
      setRequiredVat(branchDetail?.data?.isAuto);
    }
  }, [branchDetail]);

  return (
    <div>
      <Layout
        noMargin
        meta={<Meta title="Doop - Web dashboard" description="Dashboard" />}
        title={
          <div>
            <div className="flex justify-between bg-white p-4 shadow-md">
              <p className="text-2xl">
                {router.query.id === "add"
                  ? t("addNewBranch")
                  : getValues("name")}
              </p>
              <Space>
                <CustomButton
                  type="original"
                  wrapClassName="w-[100px]"
                  onClick={() => router.back()}
                >
                  Hủy
                </CustomButton>
                {router.query.id !== "add" && (
                  <CustomButton
                    type="danger"
                    wrapClassName="w-[100px]"
                    className="!bg-white text-red-500 border-red-500"
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
          </div>
        }
      >
        <form className="p-5">
          <div className="mb-6 mt-3 flex gap-6">
            <Row gutter={[16, 16]} className="w-full">
              <Col xs={24} sm={24} md={12} lg={16} xl={16}>
                <CustomCardContent className=" !bg-white">
                  <p className="font-semibold text-xl ml-3 py-2">
                    Thông tin chi nhánh
                  </p>
                  <div className="p-[15px] grid grid-cols-2  gap-5">
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label infoText="" label="Tên chi nhánh" required />
                          <CustomInput
                            {...field}
                            placeholder="Nhập tên chi nhánh"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.name?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="branchChainId"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <Label infoText="" label="Thuộc chuỗi" />
                          <CustomSelect
                            options={branchChains?.data?.content?.map(
                              (item) => ({
                                label: item.name,
                                value: item.id,
                              })
                            )}
                            {...field}
                            showSearch={true}
                            className="suffix-icon h-11 !rounded"
                            placeholder="Chọn chuỗi chi nhánh"
                            suffixIcon={
                              <div onClick={() => setOpenFormBranchChain(true)}>
                                <Image src={PlusCircle} alt="" />
                              </div>
                            }
                            addIcon={<Button type="primary">Thêm mới</Button>}
                          />
                          <InputError error={errors.branchChainId?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="address"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label infoText="" label="Địa chỉ" required />
                          <CustomInput
                            placeholder="Nhập địa chỉ"
                            className="w-[100%] h-11 flex-1"
                            {...field}
                          />
                          <InputError error={errors.address?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="phone"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Số điện thoại"
                            required={true}
                          />
                          <CustomInput
                            className="w-[100%] h-11 flex-1"
                            placeholder="Nhập số điện thoại"
                            {...field}
                          />
                          <InputError error={errors.phone?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label infoText="" label="Email" />
                          <CustomInput
                            placeholder="Nhập email"
                            className="w-[100%] h-11 flex-1"
                            {...field}
                          />
                          <InputError error={errors.email?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="manager"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Người quản lý"
                            required={false}
                          />
                          <CustomInput
                            placeholder="Nhập tên người quản lý"
                            className="w-[100%] h-11 flex-1"
                            {...field}
                          />
                        </div>
                      )}
                    />

                    <Controller
                      name="businessModel"
                      control={control}
                      render={({ field }) => (
                        <div className="col-span-2">
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
                              <>
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
                              </>
                            )}
                            showSearch={true}
                            className="suffix-icon h-11 !rounded"
                          />
                        </div>
                      )}
                    />
                  </div>
                </CustomCardContent>

                <CustomCardContent className=" !bg-white mt-5">
                  <p className="font-semibold text-xl ml-3 py-2">
                    Thông tin xuất hoá đơn VAT
                  </p>

                  <div className="p-[15px] grid grid-cols-2  gap-5">
                    <div className="col-span-2">
                      <Controller
                        name="isAuto"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <div>
                            <CustomCheckbox
                              checked={field.value}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                                setRequiredVat(e.target.checked);
                              }}
                            >
                              <strong>
                                Tự động xuất hóa đơn VAT khi gia hạn
                              </strong>
                            </CustomCheckbox>
                            <InputError error={errors.isAuto?.message} />
                          </div>
                        )}
                      />
                    </div>

                    <Controller
                      name="taxCode"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Mã số thuế"
                            required={requiredVat}
                          />
                          <CustomInput
                            {...field}
                            placeholder="Nhập mã số thuế"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.taxCode?.message} />
                        </div>
                      )}
                    />
                    <Controller
                      name="taxUnitName"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Tên đơn vị"
                            required={requiredVat}
                          />
                          <CustomInput
                            {...field}
                            placeholder="Nhập tên công ty/đơn vị"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.taxUnitName?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="taxAddress"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Địa chỉ"
                            required={requiredVat}
                          />
                          <CustomInput
                            {...field}
                            placeholder="Nhập địa chỉ cụ thể"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.taxAddress?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="taxEmail"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div>
                          <Label
                            infoText=""
                            label="Email nhận hóa đơn VAT"
                            required={requiredVat}
                          />
                          <CustomInput
                            {...field}
                            placeholder="Nhập email"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.taxEmail?.message} />
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <div className="p-[15px]">
                        <Label infoText="" label="Mô tả" />
                        <CustomTextarea
                          placeholder="Nhập mô tả"
                          {...field}
                          rows={7}
                        />
                      </div>
                    )}
                  />
                </CustomCardContent>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <CustomCardContent className=" !bg-white">
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
                </CustomCardContent>
              </Col>
            </Row>
          </div>
        </form>
      </Layout>

      {showSuccessNoti && (
        <CustomNotiAction
          isVisible={showSuccessNoti.visible}
          setIsVisible={setShowSuccessNoti}
          title={`${
            router.query.id === "add"
              ? "Tạo chi nhánh mới thành công"
              : "Cập nhật chi nhánh thành công"
          } `}
          content={showSuccessNoti.content}
          type="success"
          okText={router.query.id === "add" ? "Đi đến chi nhánh" : undefined}
          setIsOpenAddEmployee={setIsOpenAddEmployee}
          customOkFn={router.query.id === "add" ? () => {
            setShowSuccessNoti({ visible: false, content: ""});
            // @ts-ignore
            if (branchFetch) router.push(`/dashboard/${branchFetch.id}`);
          } : undefined}
        />
      )}

      {showErrorNoti && (
        <CustomNotiAction
          isVisible={showErrorNoti.visible}
          setIsVisible={setShowErrorNoti}
          title={`${
            router.query.id === "add"
              ? "Tạo chi nhánh mới thất bại"
              : "Cập nhật chi nhánh thất bại"
          } `}
          content={showErrorNoti.content}
          type="fail"
        />
      )}

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

      <AddEmployee
        isOpen={isOpenAddEmployee}
        onCancel={() => setIsOpenAddEmployee(false)}
        item={branchFetch}
      />

      <FormBranchChain
        isOpen={openFormBranchChain}
        onCancel={() => setOpenFormBranchChain(false)}
        setValueChain={setValue}
      />
    </div>
  );
}

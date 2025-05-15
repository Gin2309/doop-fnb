import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { Col, Divider, message, Row, Space } from "antd";
import Image from "next/image";
import PlusIcon from "@/assets/plusOrangeIcon.svg";

import SortingIcon from "@/assets/column-sorting.svg";

import XIcon from "@/assets/X.svg";
import { CustomRadio } from "@/components/CustomRadio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputError from "@/components/InputError";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomSwitch } from "@/components/CustomSwitch";
import {
  createSelectionGroup,
  deleteSelectionGroup,
  getDetailSelectionGroup,
  updateSelectionGroup,
} from "@/api/selection-group.service";
import { schemaSelectionGroup } from "../schema/schema";
import { isColorAvatar } from "@/utils";
import ModalProduct from "../components/ModalProduct";

const DetailSelectionGroup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);

  const [openModal, setOpenModal] = useState(false);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });
  const [productToShow, setProductToShow] = useState([]);

  const { data: selectionGroupDetail } = useQuery(
    ["CATEGORY_DETAIL", router.query.id],
    () => getDetailSelectionGroup(Number(router.query.id), branch.id),
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
    resolver: yupResolver(schemaSelectionGroup),
    mode: "onChange",
    defaultValues: {
      name: "",
      selections: [
        { name: "", price: undefined, primePrice: undefined, isDefault: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "selections",
  });

  const addSelection = () => {
    append({ name: "", price: 0, primePrice: 0, isDefault: false });
  };

  useEffect(() => {
    if (selectionGroupDetail?.data) {
      const productIds =
        selectionGroupDetail?.data?.productSelectionGroups?.map(
          (item: any) => item?.product?.id
        );
      const products = selectionGroupDetail?.data?.productSelectionGroups?.map(
        (item: any) => item?.product
      );
      setProductToShow(products);
      reset(selectionGroupDetail?.data);
      setValue("productIds", productIds);
    }
  }, [selectionGroupDetail]);

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      return router.query.id === "add"
        ? createSelectionGroup(data)
        : updateSelectionGroup(Number(router.query.id), data);
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(["SELECTION_GROUP"]);
        message.success("Thao tác thành công!");
        router.back();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteSelectionGroup(Number(router.query.id), branch.id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["SELECTION_GROUP"]);
        router.back();
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

  const onSubmit = (data) => {
    const dataMutate = {
      ...data,
      branchId: branch?.id,
    };
    mutate(dataMutate);
    // console.log(dataMutate);
  };

  const handleDelete = () => {
    mutateDelete();
  };

  const removeProduct = (item) => {
    const productIds = getValues("productIds") || [];

    const updatedProductIds = productIds.filter(
      (productId) => productId !== item.id
    );
    const updatedProductToShow = productToShow.filter(
      (product: any) => product.id !== item.id
    );

    setValue("productIds", updatedProductIds);
    setProductToShow(updatedProductToShow);
  };

  return (
    <>
      <Layout
        noMargin
        meta={
          <Meta
            title="Doop - Web dashboard"
            description="Thêm chi tiết danh mục"
          />
        }
        title={
          <div>
            <div className="flex justify-between bg-white p-4 shadow-md">
              <p className="text-2xl">
                {router.query.id === "add"
                  ? "Thêm nhóm lựa chọn"
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
        <div className="m-[20px]">
          <Row gutter={16} className="w-full ">
            <Col xs={24} sm={24} md={24} lg={24} xl={16}>
              <CustomCardItem>
                <div className="p-8 mt-5">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <div className="mb-4">
                        <Label infoText="" label="Tên nhóm lựa chọn" />
                        <CustomInput
                          {...field}
                          type="text"
                          placeholder="Nhập tên nhóm lựa chọn"
                          className="w-[100%] h-11 flex-1"
                        />
                        <InputError error={errors.name?.message} />
                      </div>
                    )}
                  />

                  <Divider />

                  {fields.map((selection, index) => (
                    <div key={selection.id} className="flex items-center mt-4">
                      <div className="grid md:grid-cols-3 gap-3 flex-1">
                        <div>
                          <Label infoText="" label={`Lựa chọn ${index + 1}`} />
                          <Controller
                            name={`selections.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <CustomInput
                                {...field}
                                type="text"
                                placeholder="Tên lựa chọn"
                                className="w-[100%] h-11 flex-1"
                              />
                            )}
                          />
                          <InputError
                            error={errors?.selections?.[index]?.name?.message}
                          />
                        </div>

                        <div>
                          <Label infoText="" label="Giá bán" />
                          <Controller
                            name={`selections.${index}.price`}
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                              <CustomInput
                                {...field}
                                type="number"
                                placeholder="Nhập giá"
                                className="w-[100%] h-11 flex-1"
                              />
                            )}
                          />
                          <InputError
                            error={errors?.selections?.[index]?.price?.message}
                          />
                        </div>

                        <div>
                          <Label infoText="" label="Giá vốn" />
                          <Controller
                            name={`selections.${index}.primePrice`}
                            defaultValue={0}
                            control={control}
                            render={({ field }) => (
                              <CustomInput
                                {...field}
                                type="number"
                                placeholder="Nhập giá"
                                className="w-[100%] h-11 flex-1"
                              />
                            )}
                          />
                          <InputError
                            error={
                              errors?.selections?.[index]?.primePrice?.message
                            }
                          />
                        </div>

                        <Controller
                          name={`selections.${index}.isDefault`}
                          control={control}
                          render={({ field }) => {
                            return (
                              <div className="col-span-1">
                                <CustomCheckbox
                                  {...field}
                                  checked={field.value}
                                  className="translate-y-[-5px]"
                                >
                                  Chọn mặc định
                                </CustomCheckbox>
                              </div>
                            );
                          }}
                        />
                      </div>

                      <div
                        className="p-3 flex items-center justify-center cursor-pointer"
                        onClick={() => remove(index)}
                      >
                        <Image src={XIcon} />
                      </div>
                    </div>
                  ))}

                  <CustomButton
                    type="primary"
                    className="!w-fit !bg-none text-[#F38B25] -ml-4"
                    onClick={addSelection}
                    prefixIcon={<Image src={PlusIcon} />}
                  >
                    Thêm lựa chọn
                  </CustomButton>
                </div>
              </CustomCardItem>

              <CustomCardItem>
                <div className="p-8 mt-5">
                  <div className="grid lg:grid-cols-2 gap-5">
                    <Controller
                      name="minSelect"
                      control={control}
                      defaultValue={0}
                      render={({ field }) => (
                        <div className="">
                          <Label infoText="" label="Chọn tối thiểu" />
                          <CustomInput
                            {...field}
                            type="number"
                            placeholder="Chọn tối thiểu"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.minSelect?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="maxSelect"
                      control={control}
                      render={({ field }: { field: any }) => (
                        <div className="">
                          <Label infoText="" label="Chọn tối đa" />
                          <CustomInput
                            {...field}
                            type="number"
                            placeholder="Không bắt buộc"
                            className="w-[100%] h-11 flex-1"
                          />
                          <InputError error={errors.maxSelect?.message} />
                        </div>
                      )}
                    />
                  </div>

                  <Divider />

                  <Controller
                    name="isMultiSelect"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                      <div className="">
                        <div className="flex justify-between">
                          <Label
                            infoText=""
                            label="Cho phép chọn nhiều số lượng trên mỗi lựa chọn"
                          />
                          <CustomSwitch
                            checked={field.value}
                            onChange={(e) => field.onChange(e)}
                          />
                        </div>
                        <InputError error={errors.isMultiSelect?.message} />
                      </div>
                    )}
                  />
                </div>
              </CustomCardItem>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              <CustomCardItem>
                <div
                  className="px-5 pt-5 mb-2 mt-5"
                  onClick={() => setOpenModal(true)}
                >
                  <Label infoText="" label="Mặt hàng liên kết" />
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="flex p-3 justify-between border rounded-md cursor-pointer"
                  >
                    <p>Chọn mặt hàng liên kết</p>
                    <Image src={SortingIcon} />
                  </div>
                </div>

                {productToShow?.length > 0 ? (
                  productToShow?.map((item: any, index) => (
                    <div
                      key={item?.id}
                      className={`flex justify-between items-center px-8 py-3 border-b `}
                    >
                      <div className="flex flex-1 items-center gap-5">
                        <p className="font-semibold text-xl w-[40px]">
                          {index + 1}
                        </p>
                        <div className="">
                          {isColorAvatar(item.avatarUrl) ? (
                            <div
                              className="w-[60px] h-[60px] rounded-lg"
                              style={{
                                backgroundColor: item.avatarUrl,
                              }}
                            />
                          ) : (
                            <Image
                              width={60}
                              height={60}
                              alt="cafe"
                              src={item.avatarUrl || "/images/services1.png"}
                            />
                          )}
                        </div>
                        <p className="text-[#3355FF]">{item?.name}</p>
                      </div>
                      <div
                        className="p-3 flex items-center justify-center cursor-pointer"
                        onClick={() => removeProduct(item)}
                      >
                        <Image src={XIcon} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#B2B2B2] mx-7 pb-5">
                    Chọn nhanh mặt hàng liên kết với nhóm lựa chọn
                  </p>
                )}
              </CustomCardItem>
            </Col>
          </Row>
        </div>
      </Layout>
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

      {openModal && (
        <ModalProduct
          title="Mặt hàng liên kết"
          isOpen={openModal}
          onCancel={() => setOpenModal(false)}
          setValue={setValue}
          getValues={getValues}
          productToShow={productToShow}
          setProductToShow={setProductToShow}
        />
      )}
    </>
  );
};

export default DetailSelectionGroup;

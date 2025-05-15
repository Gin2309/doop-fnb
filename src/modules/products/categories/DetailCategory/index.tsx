import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { Col, Divider, message, Row, Space } from "antd";
import SearchIcon from "@/assets/searchIcon.svg";
import Image from "next/image";
import { EmptyState } from "@/components/CustomNoEmty";
import ProductEmty from "@/assets/images/product_empty.png";
import Item1 from "@/assets/images/item1.png";
import RemoveIcon from "@/assets/closeIcon.svg";
import { CustomRadio } from "@/components/CustomRadio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCategory,
  getDetailCategory,
  updateCategory,
} from "@/api/category.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputError from "@/components/InputError";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
// import { schemaUpdateCategry } from "../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatCurrency, isColorAvatar, isIconAvatar } from "@/utils";
import XIcon from "@/assets/X.svg";
import CustomIconPicker from "@/components/CustomIconPicker";
import CustomUpload from "@/components/CustomUpload";
import { CustomCardContent } from "@/components/CustomCardContent";
import ModalProduct from "../components/ModalProduct";
import { schemaUpdateCategory } from "../schema/schema";

const DetailCategory = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [productToShow, setProductToShow] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [avatarOption, setAvatarOption] = useState("icon");

  const filteredProducts = productToShow.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const branch = useRecoilValue(branchStateSession);

  const { data: categoryDetail } = useQuery(
    ["CATEGORY_DETAIL", router.query.id],
    () => getDetailCategory(Number(router.query.id), branch.id)
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaUpdateCategory),
    mode: "onChange",
  });

  useEffect(() => {
    if (categoryDetail?.data) {
      if (isIconAvatar(categoryDetail?.data?.avatarUrl)) {
        setAvatarOption("icon");
      } else {
        setAvatarOption("picture");
      }
      reset(categoryDetail?.data);

      const productIds = categoryDetail?.data?.products.map(
        (product: any) => product.id
      );
      setValue("productIds", productIds);
      setProductToShow(categoryDetail?.data?.products);
    }
  }, [categoryDetail]);

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      return updateCategory(Number(router.query.id), data);
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(["CATEGORY"]);
        message.success("Cập nhật danh mục thành công");
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
      return deleteCategory(Number(router.query.id), branch.id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CATEGORY"]);
        router.back();
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
        message.success("Xóa danh mục thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = (data) => {
    const productIds = productToShow.map((product: any) => product.id);
    const mutateData = {
      ...data,
      productIds: productIds,
    };
    mutate(mutateData);
  };

  const handleDelete = () => {
    mutateDelete();
  };

  const removeProduct = (item) => {
    const updatedProductToShow = productToShow.filter(
      (product: any) => product.id !== item.id
    );
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
              <p className="text-2xl">{getValues("name")}</p>
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
        <div className="my-[20px] mx-5">
          <Row gutter={[16, 16]} className="w-full">
            <Col xs={24} sm={24} md={12} lg={16} xl={16}>
              <CustomCardItem className="p-8">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <Label infoText="" label="Tên danh mục" />
                      <CustomInput
                        {...field}
                        placeholder="Nhập tên danh mục"
                        type="text"
                        className="w-[100%] h-11 flex-1"
                      />
                      <InputError error={errors.name?.message} />
                    </div>
                  )}
                />

                <Divider />
                <div className="mb-4">
                  <Label infoText="" label="Danh sách mặt hàng" />
                  <Space.Compact block>
                    <div className="flex-1">
                      <CustomInput
                        type="text"
                        className="h-11 flex-1"
                        onChange={(e) => setSearchTerm(e)}
                        placeholder="Tìm kiếm mặt hàng"
                      />
                    </div>

                    <CustomButton
                      type="submit"
                      onClick={() => setOpenModal(true)}
                      prefixIcon={<Image src={SearchIcon} />}
                    >
                      Tìm kiếm
                    </CustomButton>
                  </Space.Compact>
                </div>
                <div className="flex flex-col gap-[15px] mt-[25px]">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((item: any, index) => (
                      <div
                        className="flex justify-between items-center p-[15px]"
                        key={index}
                      >
                        <div className="flex items-center gap-[20px]">
                          <span className="mr-[20px]">{index + 1}</span>
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
                          <span className="text-[#3355FF] font-semibold py-[3px] ">
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-[15px]">
                          <span>
                            {item?.variants?.length > 1
                              ? `${item?.variants?.length} giá`
                              : formatCurrency(item.variants[0]?.price)}
                          </span>

                          <div
                            className="p-3 flex items-center justify-center cursor-pointer"
                            onClick={() => removeProduct(item)}
                          >
                            <Image src={XIcon} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      imageSrc={ProductEmty}
                      title={
                        searchTerm !== ""
                          ? `Không có mặt hàng ${searchTerm} nào trong danh mục`
                          : "Không có mặt hàng nào trong danh mục này"
                      }
                    />
                  )}
                </div>
              </CustomCardItem>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <CustomCardContent className=" !bg-white">
                <div className="p-[15px]">
                  <Label infoText="" label="Hình đại diện" required={false} />
                  <CustomRadio
                    options={[
                      { value: "icon", label: "Biểu tượng" },
                      { value: "picture", label: "Hình ảnh" },
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
                      <CustomIconPicker
                        value={getValues("avatarUrl") || ""}
                        onChangeValue={(url) => setValue("avatarUrl", url)}
                      />
                    )}
                  </div>
                </div>
              </CustomCardContent>
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

export default DetailCategory;

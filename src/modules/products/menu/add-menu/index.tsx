import { CustomCardContent } from "@/components/CustomCardContent";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import Item1 from "@/assets/images/item1.png";
import ProductEmty from "@/assets/images/product_empty.png";
import { Col, Divider, message, Row, Space } from "antd";
import Image from "next/image";
import ArrownCardIcon from "@/assets/arrowsOutCard.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import RemoveIcon from "@/assets/closeIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomRadio } from "@/components/CustomRadio";
import { EmptyState } from "@/components/CustomNoEmty";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useEffect, useState } from "react";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCreateMenu } from "./schema/schema";
import { createMenu, getDetailMenu, updateMenu } from "@/api/menu.service";
import { CustomCardItem } from "@/components/CustomCardItem";
import CustomIconPicker from "@/components/CustomIconPicker";
import InputError from "@/components/InputError";
import ModalProduct from "../components/ModalProduct";
import { formatCurrency, isColorAvatar, isIconAvatar } from "@/utils";
import XIcon from "@/assets/X.svg";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import CustomUpload from "@/components/CustomUpload";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMoveMutable } from "array-move";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../components/SortableItem";

const radioOptions = [
  { value: "option1", label: "Biểu tượng" },
  { value: "option2", label: "Thứ tự thực đơn" },
];

const AddMenu = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openModalCombo, setOpenModalCombo] = useState(false);
  const [productToShow, setProductToShow] = useState<any>([]);
  const branch = useRecoilValue(branchStateSession);
  const [avatarOption, setAvatarOption] = useState("icon");

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCreateMenu),
    mode: "onChange",
  });

  const { data: menuDetail } = useQuery(
    ["CATEGORY_DETAIL", router.query.id],
    () => getDetailMenu(Number(router.query.id), branch.id),
    { enabled: Boolean(router.query.id && router.query.id !== "add") }
  );

  useEffect(() => {
    if (menuDetail?.data) {
      setAvatarOption(
        isIconAvatar(menuDetail.data.avatarUrl) ? "icon" : "picture"
      );

      reset(menuDetail.data);

      const productIds = menuDetail?.data?.products?.map(
        (item: any) => item?.id
      );
      const products = menuDetail?.data?.products?.map((item: any) => item);
      setProductToShow(products);
      setValue("productIds", productIds);
    }
  }, [menuDetail]);

  const { mutate: mutate, isLoading: isLoadingMutate } = useMutation(
    (data) => {
      return router.query.id === "add"
        ? createMenu(data)
        : updateMenu(Number(router.query.id), data);
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(["MENU"]);
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

  const onSubmit = (data) => {
    const dataMutate = {
      ...data,
      branchId: branch?.id,
    };
    mutate(dataMutate);
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setProductToShow((items) => {
        const oldIndex = items.findIndex(
          (item) => String(item.id) === String(active.id)
        );
        const newIndex = items.findIndex(
          (item) => String(item.id) === String(over.id)
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);

          const newProductIds = newItems.map((item: any) => item.id);
          setValue("productIds", newProductIds);

          return newItems;
        }

        return items;
      });
    }
  };

  return (
    <Layout
      noMargin
      meta={
        <Meta title="Doop - Web dashboard" description="Thêm mới thực đơn" />
      }
      title={
        <div>
          <div className="flex justify-between bg-white p-4 shadow-md">
            <p className="text-2xl">
              {" "}
              {router.query.id === "add"
                ? "Thêm mới thực đơn"
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
      <div className="mt-[20px]">
        <Row gutter={16} className="w-full ">
          <Col xs={24} sm={4} md={12} lg={16} xl={16}>
            <CustomCardContent className="!rounded-[12px] !bg-white p-[15px]">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <Label infoText="" label="Tên thực đơn" />
                    <CustomInput
                      {...field}
                      placeholder="Nhập tên thực đơn"
                      type="text"
                      className="w-[100%] h-11 flex-1"
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />

              <Divider />

              <div className="mb-4">
                <Label infoText="" label="Thêm mặt hàng, combo, khuyến mại" />
                <Space.Compact
                  block
                  className="cursor-pointer"
                  onClick={() => setOpenModalCombo(true)}
                >
                  <div className="flex-1 border-[1px] border-[#cccc] rounded-l-md">
                    <div className="h-11 text-[#666666] flex-1 flex items-center p-3  ">
                      Tìm kiếm mặt hàng, combo, khuyến mãi"
                    </div>
                  </div>
                  <CustomButton
                    type="submit"
                    prefixIcon={<Image src={SearchIcon} />}
                  >
                    Tìm kiếm
                  </CustomButton>
                </Space.Compact>
              </div>

              <div className="flex flex-col gap-[15px] mt-[25px]">
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={productToShow.map((item: any) => String(item.id))}
                    strategy={verticalListSortingStrategy}
                  >
                    {productToShow?.length > 0 ? (
                      productToShow.map((item: any, index) => (
                        <SortableItem
                          key={item.id}
                          id={String(item.id)}
                          item={item}
                          index={index}
                          removeProduct={removeProduct}
                        />
                      ))
                    ) : (
                      <EmptyState
                        imageSrc={ProductEmty}
                        title="Thực đơn chưa có mặt hàng nào"
                        description="Bạn hãy thêm mới mặt hàng cho thực đơn này nhé"
                      />
                    )}
                  </SortableContext>
                </DndContext>
              </div>
            </CustomCardContent>
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

        {openModalCombo && (
          <ModalProduct
            title="Thêm mặt hàng, combo, khuyến mại"
            isOpen={openModalCombo}
            onCancel={() => setOpenModalCombo(false)}
            setValue={setValue}
            getValues={getValues}
            productToShow={productToShow}
            setProductToShow={setProductToShow}
          />
        )}
      </div>
    </Layout>
  );
};

export default AddMenu;

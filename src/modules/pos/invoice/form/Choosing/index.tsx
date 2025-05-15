import { useState } from "react";
import Image from "next/image";

import { formatCurrency } from "@/utils";
import { message, Spin } from "antd";
import { customMessage } from "@/utils/messageHelper";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import ModalWarn from "@/components/CustomModal/ModalWarn";
import ModalEditOption from "../components/ModalEditOption";

import Pencil from "@/assets/editBlue.svg";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPositonAddItems } from "@/api/area-pos.service";

export default function Choosing({
  data,
  productChoosing,
  setProductChoosing,
  setSelectTab,
  handleSubmitUpdateCurrentBill,
  refetch,
}) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);
  const [isOpenFormEdit, setIsOpenFormEdit] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);

  const handleSelectItem = (item) => {
    setSelectedItem((prev) => (prev === item ? null : item));
  };

  const handleIncreaseQuantity = (variantId) => {
    setProductChoosing((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? {
              ...item,
              quantity: item.quantity + 1,
              groups: item.groups.map((group) => ({
                ...group,
                quantity: group.quantity + 1,
              })),
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (variantId) => {
    setProductChoosing((prev) =>
      prev.map((item) =>
        item.variantId === variantId && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              groups: item.groups.map((group) => ({
                ...group,
                quantity: group.quantity > 1 ? group.quantity - 1 : 1,
              })),
            }
          : item
      )
    );
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    let quantity = parseFloat(newQuantity);
    if (isNaN(quantity)) quantity = 1;
    quantity = Math.max(1, quantity); // Ensure the quantity is at least 1
    setProductChoosing((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const handleDeleteItem = (variantId, groups) => {
    setProductChoosing((prev) =>
      prev.filter(
        (item) =>
          item.variantId !== variantId ||
          JSON.stringify(item.groups) !== JSON.stringify(groups)
      )
    );
  };

  const { mutate: mutate, isLoading } = useMutation(
    (data: any) => {
      return createPositonAddItems(data.currentBillId, data);
    },
    {
      onSuccess: async () => {
        setProductChoosing([]);
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        setSelectTab(1);
        customMessage.success("Thêm món thành công");
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = () => {
    if (isLoading) return;

    handleSubmitUpdateCurrentBill();
    if (productChoosing?.length > 0) {
      const dataMutate = {
        currentBillId: data?.currentBill?.id,
        items: productChoosing,
        branchId: branch?.id,
      };

      mutate(dataMutate);
    } else {
      setSelectTab(1);
    }
  };

  const onSubmitCancel = () => {
    if (selectedItem) {
      handleDeleteItem(selectedItem.variantId, selectedItem.groups);
      setSelectedItem(null);
    }
    setOpenModalCancel(false);
  };

  return (
    <>
      <div className="flex-1 pb-[62px]">
        <div className="flex flex-col overflow-auto">
          {productChoosing?.map((item) => {
            const totalPrice =
              item.variantPrice * item.quantity +
              item.groups.reduce(
                (acc, group) => acc + group.price * group.quantity,
                0
              );

            const isSelected = selectedItem === item;

            return (
              <div
                key={item.variantId}
                className={`p-2 ${isSelected ? "bg-[#FF5C00]" : "bg-white"}`}
              >
                <div
                  className={`flex gap-2 py-3 justify-between  border-b border-dashed relative `}
                >
                  <div
                    className="flex flex-col gap-1 "
                    style={{
                      color: isSelected ? "white" : "black",
                    }}
                  >
                    <p className="text-lg font-bold">{item.productName}</p>
                    <p
                      style={{
                        color: isSelected ? "white" : "#666666",
                      }}
                    >
                      {item.variantName}
                    </p>
                    {item?.groups?.map((group) => (
                      <p
                        style={{
                          color: isSelected ? "white" : "#666666",
                        }}
                      >
                        x {group.quantity} {group.name} (
                        {formatCurrency(group.price)})
                      </p>
                    ))}
                  </div>
                  <div className="flex mr-2 gap-5">
                    <div className="flex flex-col gap-2 justify-between items-end mr-10">
                      <p
                        className="text-lg font-bold"
                        style={{
                          color: isSelected ? "white" : "black",
                        }}
                      >
                        {item.productType === "TIME"
                          ? formatCurrency(item?.variantPrice)
                          : formatCurrency(totalPrice)}
                      </p>
                      {item.productType !== "TIME" && !isSelected && (
                        <div className="flex gap-5 items-center">
                          <div
                            onClick={() =>
                              handleDecreaseQuantity(item.variantId)
                            }
                            className={`flex justify-center items-center text-xl rounded-full border-[1px] w-[32px] h-[32px]  ${
                              item.quantity < 2
                                ? " border-[#B2B2B2] text-[#B2B2B2]  cursor-not-allowed"
                                : "border-[#E50000] text-[#E50000] cursor-pointer  "
                            }`}
                          >
                            -
                          </div>
                          <CustomInput
                            // type="number"
                            value={item.quantity}
                            preChange={(value) => {
                              return !value || /^\d+(\.\d{0,2})?$/.test(`${value}`);
                            }}
                            onChange={(e) =>
                              handleQuantityChange(item.variantId, e)
                            }
                            className="text-xl w-[70px] border-none text-center"
                          />

                          <div
                            onClick={() =>
                              handleIncreaseQuantity(item.variantId)
                            }
                            className="flex justify-center items-center text-xl rounded-full border-[#3355FF] border-[1px] w-[32px] h-[32px] text-[#3355FF] cursor-pointer"
                          >
                            +
                          </div>
                        </div>
                      )}
                    </div>

                    {!isSelected ? (
                      <div
                        onClick={() => handleSelectItem(item)}
                        className="absolute top-[40%] right-5 cursor-pointer flex items-center"
                      >
                        <Image src={Pencil} />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setSelectedItem(null);
                        }}
                        className=" absolute top-[40%] right-5 h-5 w-5 justify-center cursor-pointer border-[1px] border-white rounded-full text-white flex items-center"
                      >
                        x
                      </div>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {[
                      {
                        label: "Huỷ",
                        onClick: () => {
                          setOpenModalCancel(true);
                        },
                        className: "text-[#E50000]",
                      },
                      ...(item?.productType !== "TIME"
                        ? [
                            {
                              label: "Thêm lựa chọn",
                              onClick: () => {
                                setIsOpenFormEdit(true);
                              },
                            },
                          ]
                        : []),
                    ].map((button, index) => (
                      <div
                        key={index}
                        onClick={button.onClick}
                        className={`bg-white py-2 px-5 rounded-lg cursor-pointer hover:bg-[#eeee] text-center border-[#D7DFE9] border-[1px] ${
                          button.className || "text-black"
                        }`}
                      >
                        {button.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t p-2 absolute bottom-0 bg-white w-[419px]">
        <CustomButton
          type="primary"
          wrapClassName="flex-grow"
          className="!rounded-lg"
          onClick={onSubmit}
        >
          {isLoading ? <Spin /> : "Xác nhận"}
        </CustomButton>
      </div>

      {isOpenFormEdit && (
        <ModalEditOption
          isOpen={isOpenFormEdit}
          onCancel={() => setIsOpenFormEdit(false)}
          productEdit={selectedItem}
          productChoosing={productChoosing}
          setProductChoosing={setProductChoosing}
          billId={data?.currentBill?.id}
          refetch={refetch}
        />
      )}

      {openModalCancel && (
        <ModalWarn
          title="Hủy món?"
          content="Bạn có chắc chắn muốn hủy món ăn này không?"
          isOpen={openModalCancel}
          onCancel={() => setOpenModalCancel(false)}
          onSuccess={onSubmitCancel}
        />
      )}
    </>
  );
}

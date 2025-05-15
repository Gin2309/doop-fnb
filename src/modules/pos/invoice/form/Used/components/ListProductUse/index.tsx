import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";

import { message } from "antd";
import {
  calculateEndTime,
  formatCurrency,
  formatTimeCreateAtPOS,
} from "@/utils";
import ModalActionItem from "../ModalActionItem";
import ModalCancelBill from "@/modules/pos/invoice/components/ModalCancel";

import Pencil from "@/assets/editBlue.svg";

import { useMutation } from "@tanstack/react-query";
import { sliceTime } from "@/api/current-bill-item.service";

export default function ListProductUse({
  style,
  data,
  refetch,
  setTransferItem,
  setOpenTransferItem,
}: {
  style?: any;
  data: any;
  refetch: any;
  setTransferItem?: any;
  setOpenTransferItem?: any;
}) {
  const currentTime = dayjs().format("HH:mm");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [openModalAction, setOpenModalAction] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number| null>(null);
  const [typeAction, setTypeAction] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelectItem = (id) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const { mutate: sliceMutation } = useMutation((id: any) => sliceTime(id), {
    onSuccess: () => {
      message.success("Cắt giờ hiện tại thành công");
      refetch();
    },
    onError(err: any) {
      const errorMessage =
        err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleSliceTime = (id: any) => {
    sliceMutation(id);
    setSelectedItemId(null);
  };

  return (
    <>
      <div className="flex flex-col overflow-auto " style={style}>
        {data?.currentBill?.currentBillItems?.filter(bI => bI?.kdsStatus !== "CANCEL")?.map((item) => {
          const totalPrice =
            item?.itemPrice * item?.quantity +
            item.openSelects.reduce(
              (acc, group) => acc + group.selection.price * group.quantity,
              0
            );

          const isSelected = selectedItemId === item.id;

          const isItemTypeTime = item?.product?.productType === "TIME"
          const disabledCancel = ["SERVING", "SERVED"].includes(item?.kdsStatus) || isItemTypeTime;

          return (
            <div
              key={item.id}
              className={`flex flex-col gap-2 p-2 border-b border-dashed ${
                isSelected ? "bg-[#FF5C00]" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex flex-wrap items-center gap-2"
                  style={{
                    color: isSelected ? "white" : "black",
                  }}
                >
                  <p>{item?.product?.name}</p>{" "}
                  {item.kdsStatus === "PENDING" && (
                    <div className="px-2 py-1 text-[#FF5C00] bg-[#FFECEB] rounded-2xl">
                      Chờ chế biến
                    </div>
                  )}
                  {item.kdsStatus === "SERVING" && (
                    <div className="px-2 py-1 text-[#FFA500] bg-[#FFF4E5] rounded-2xl">
                      Đang phục vụ
                    </div>
                  )}
                  {item.kdsStatus === "SERVED" && (
                    <div className="px-2 py-1 text-[#00C853] bg-[#E8F5E9] rounded-2xl">
                      Đã phục vụ
                    </div>
                  )}
                  {item.kdsStatus === "UNPAID" && (
                    <div className="px-2 py-1 text-[#00C853] bg-[#E8F5E9] rounded-2xl">
                      Chờ thanh toán
                    </div>
                  )}
                </div>
                {!isSelected ? (
                  <Image
                    src={Pencil}
                    onClick={() => handleSelectItem(item.id)}
                    className="cursor-pointer"
                  />
                ) : (
                  <div
                    onClick={() => setSelectedItemId(null)}
                    className="cursor-pointer p-1 border-[1px] justify-center border-white rounded-full text-white flex items-center h-5 w-5"
                  >
                    x
                  </div>
                )}
              </div>
              <p
                style={{
                  color: isSelected ? "white" : "#0094FF",
                }}
              >
                {item?.variant?.name}
              </p>
              {item?.openSelects?.map((group) => (
                <p
                  style={{
                    color: isSelected ? "white" : "#666666",
                  }}
                >
                  x {group.quantity} {group.selection.name} (
                  {formatCurrency(group.selection.price)})
                </p>
              ))}
              {item?.product?.productType === "TIME" && (
                <>
                  <p
                    className={`${
                      isSelected ? "text-white" : "text-[#666666]"
                    } `}
                  >
                    Giờ vào:{" "}
                    <span
                      className={`${
                        isSelected ? "text-white" : "text-[#333333]"
                      }  font-medium`}
                    >
                      {formatTimeCreateAtPOS(item?.startTime)}
                    </span>
                  </p>
                  <p
                    className={`${
                      isSelected ? "text-white" : "text-[#666666]"
                    } `}
                  >
                    Đã sử dụng:{" "}
                    <span
                      className={`${
                        isSelected ? "text-white" : "text-[#333333]"
                      }  font-medium`}
                    >
                      {calculateEndTime(item?.startTime)}
                    </span>
                  </p>
                </>
              )}
              <div className="flex items-center">
                <div
                  className="w-2/3"
                  style={{
                    color: isSelected ? "white" : "black",
                  }}
                >
                  {formatCurrency(item?.itemPrice || item?.variant?.price)}
                </div>
                <div
                  className="flex justify-between w-1/3"
                  style={{
                    color: isSelected ? "white" : "black",
                  }}
                >
                  <p>
                    {item?.product?.productType !== "TIME" &&
                      `x${item?.quantity}`}
                  </p>
                  <p className="font-medium">
                    {formatCurrency(item.finalPrice)}
                  </p>
                </div>
              </div>
              {item?.product?.productType !== "TIME" && (
                <p
                  style={{
                    color: isSelected ? "white" : "#666666",
                  }}
                  className="italic text-[12px]"
                >
                  {formatTimeCreateAtPOS(item?.createdAt)} - Tạo bởi{" "}
                  {item?.creatorName}
                </p>
              )}

              {item?.product?.productType === "TIME" && (
                <div
                  className={`flex ${
                    isSelected ? "text-white" : "text-primary"
                  }`}
                >
                  Thời điểm tạm tính:&nbsp;
                  <span>{currentTime}</span>
                </div>
              )}

              {(item?.voucherPercent || item?.voucherValue) && (
                <div className="flex items-center">
                  <div
                    className="w-2/3 italic"
                    style={{
                      color: isSelected ? "white" : "black",
                    }}
                  >
                    KHUYẾN MÃI
                  </div>
                  <div
                    className="flex justify-between w-1/3"
                    style={{
                      color: isSelected ? "white" : "black",
                    }}
                  >
                    <p>
                      {item?.voucherPercent
                        ? `${item?.voucherPercent}%`
                        : formatCurrency(item?.voucherValue)}
                    </p>
                    <p className="font-medium">
                      {"-"}
                      {item?.voucherPercent
                        ? `${formatCurrency(
                            (item?.voucherPercent / 100) * totalPrice
                          )}`
                        : formatCurrency(item?.voucherValue)}
                    </p>
                  </div>
                </div>
              )}

              {isSelected && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {[
                    {
                      label: "Huỷ",
                      onClick: () => {
                        if(disabledCancel){
                          message.error("Không được huỷ");
                          return;
                        }
                        setOpen(true)
                      },
                      className: "text-[#E50000]",
                      disabled: disabledCancel
                    },
                    {
                      label: "Trả lại",
                      onClick: () => {
                        if(isItemTypeTime) {
                          message.error("Không được huỷ");
                          return;
                        }
                        setOpenModalAction(true);
                        setTypeAction("RETURN");
                      },
                      disabled: isItemTypeTime
                    },
                    {
                      label: "Chuyển đi",
                      onClick: () => {
                        if(isItemTypeTime) {
                          message.error("Không được huỷ");
                          return;
                        }
                        setOpenTransferItem(true);
                        setTransferItem({
                          id: item?.id,
                          currentBillId: data?.currentBill?.id,
                          quantity: item?.quantity,
                          selections: item?.openSelects?.map((item: any) => ({
                            selectionId: item?.selection?.id,
                            quantity: item.quantity,
                          })),
                        });
                      },
                      disabled: isItemTypeTime
                    },
                    {
                      label: "Đổi đơn giá",
                      onClick: () => {
                        setOpenModalAction(true);
                        setCurrentPrice(item?.itemPrice || item?.variant?.price);
                        setTypeAction("CHANGE_PRICE");
                      },
                    },
                    {
                      label: "Giảm giá",
                      onClick: () => {
                        setOpenModalAction(true);
                        setTypeAction("DISCOUNT");
                      },
                    },
                    ...(isItemTypeTime
                      ? [
                          {
                            label: "Cắt giờ hiện tại",
                            onClick: () =>{
                                if(item?.kdsStatus === "SERVED") {
                                  message.error("Không được cắt giờ");
                                  return 
                                }
                               handleSliceTime(item.id)
                              },
                            disabled: item?.kdsStatus === "SERVED"
                          },
                        ]
                      : []),
                  ].map((button, index) => (
                    <div
                      key={index}
                      onClick={button.onClick}
                      className={`
                        bg-white py-2 px-5 rounded-lg cursor-pointer hover:bg-[#eeee] text-center border-[#D7DFE9] border-[1px] 
                        ${button.className || (isItemTypeTime ? "" : "text-black")} ${button.disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
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
      {openModalAction && (
        <ModalActionItem
          isOpen={openModalAction}
          onCancel={() => setOpenModalAction(false)}
          data={data}
          type={typeAction}
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          refetch={refetch}
          currentPrice={currentPrice || 0}
        />
      )}

      <ModalCancelBill
        isOpen={open}
        onCancel={() => setOpen(false)}
        id={data?.currentBill?.id}
        itemId={selectedItemId}
        setId={setSelectedItemId}
        type="ITEM"
      />
    </>
  );
}

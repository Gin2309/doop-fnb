import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { message } from "antd";
import { customMessage } from "@/utils/messageHelper";

import InputError from "@/components/InputError";
import bxs_tag_x from "@/assets/bxs_tag-x.svg";

import { branchStateSession } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  addDiscountItemCurrentBill,
  returnItemCurrentBill,
  updateItemCurrentBill,
  transferItem,
} from "@/api/current-bill-item.service";
import { CustomButton } from "@/components/CustomButton";
import CustomNotiAction from "@/modules/account-setup/ChangePhone/NotiDashboard";
import { formatCurrency } from "@/utils";

const ModalActionItem = ({
  isOpen,
  onCancel,
  data,
  type,
  selectedItemId,
  setSelectedItemId,
  refetch,
  currentPrice
}: {
  isOpen: boolean;
  onCancel: () => void;
  data: any;
  type: any;
  selectedItemId: any;
  setSelectedItemId: any;
  refetch: any;
  currentPrice: number
}) => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const queryClient = useQueryClient();
  const [itemPrice, setItemPrice] = useState<any>("");
  const [typeDiscount, setTypeDiscount] = useState("percent");
  const [valueDiscount, setValueDiscount] = useState<any>("");
  const [quantity, setQuantity] = useState(1);
  const [warningChangePrice, setWarningChangePrice] = useState<{
    open: boolean;
    newPrice: number | null;
    dataUpdate: any
  }>({
    open: false,
    newPrice: null,
    dataUpdate: null
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { mutate: mutateItem } = useMutation(
    (data: any) => {
      return updateItemCurrentBill(data?.id, data);
    },
    {
      onSuccess: async () => {
        onCancel();
        customMessage.success("Thao tác thành công");
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        setSelectedItemId(null);

        reset();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const { mutate: mutateAddDiscount } = useMutation(
    (data: any) => {
      return addDiscountItemCurrentBill(data);
    },
    {
      onSuccess: async () => {
        onCancel();
        customMessage.success("Thao tác thành công");
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        setSelectedItemId(null);

        reset();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const { mutate: mutateReturnItem } = useMutation(
    (data: any) => {
      return returnItemCurrentBill(data?.id, data);
    },
    {
      onSuccess: async () => {
        onCancel();
        customMessage.success("Thao tác thành công");
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        setSelectedItemId(null);

        reset();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = (dataMutate: any) => {
    if (type === "CHANGE_PRICE") {
      if (itemPrice === "") return;

      const dataChangePrice = {
        ...dataMutate,
        id: selectedItemId,
        itemPrice: itemPrice,
        currentBillId: data?.currentBill?.id,
      };

      refetch().then(value => {
        const newDataItem = value?.data?.data?.currentBill?.currentBillItems?.find(b => b.id === selectedItemId);
        if(newDataItem) {
          const newPrice = newDataItem.itemPrice || newDataItem.variant?.price;
          if(newPrice !== currentPrice) {
            // giá đã được cập nhật bởi một bên khác
            setWarningChangePrice({
              open: true,
              newPrice,
              dataUpdate: dataChangePrice
            })
            return;
          }
        }
        mutateItem(dataChangePrice);
      });

    } else if (type === "DISCOUNT") {
      const dataDiscount = {
        id: selectedItemId,
        currentBillId: data?.currentBill?.id,
        currentBillItemId: selectedItemId,
        value: typeDiscount === "value" ? valueDiscount : null,
        percent: typeDiscount === "percent" ? valueDiscount : null,
        type: "VOUCHER",
        branchId: branchId,
      };

      mutateAddDiscount(dataDiscount);
    } else if (type === "RETURN") {
      const dataReturn = {
        ...dataMutate,
        id: selectedItemId,
        currentBillId: data?.currentBill?.id,
        quantity: quantity,
      };

      console.log(dataReturn);

      mutateReturnItem(dataReturn);
    }
  };

  const handleCancel = () => {
    onCancel();
    reset();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={handleCancel}
      title={
        type === "CHANGE_PRICE"
          ? "Đổi đơn giá"
          : type === "DISCOUNT"
          ? "Giảm giá mặt hàng"
          : type === "RETURN"
          ? "Trả lại món"
          : ""
      }
      width={1000}
      onSubmit={handleSubmit(onSubmit)}
      customFooter={type === "DISCOUNT"}
      textOk={
        type === "CHANGE_PRICE"
          ? "Xác nhận"
          : type === "RETURN"
          ? "Xác nhận và thông báo tới KDS"
          : ""
      }
    >
      <CustomNotiAction 
        isVisible={warningChangePrice.open}
        // setIsVisible={setWarningChangePrice}
        onCancel={() => {
          setWarningChangePrice({
            open: false,
            dataUpdate: null,
            newPrice: null
          })
        }}
        type="warn"
        title={`Xảy ra thay đổi giá mới : ${formatCurrency(warningChangePrice.newPrice || 0)}`}
        content={`Bạn có chắc chắn muốn đổi đơn giá mới là: ${formatCurrency(warningChangePrice.dataUpdate?.itemPrice || 0)} ?`}
        textOk="Xác nhận cập nhật"
      />
      {type === "CHANGE_PRICE" ? (
        <div className="gap-3 flex flex-col">
          <div>
            <CustomInput
              className={`suffix-icon h-11 !rounded`}
              type="number"
              placeholder="Nhập giá bán"
              onChange={(e) => setItemPrice(e)}
              value={itemPrice}
            />
            {itemPrice === "" && <InputError error="Vui lòng nhập giá bán" />}
          </div>

          <Controller
            name="note"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Label infoText="" label={t("Ghi chú")} />
                <CustomInput
                  placeholder="Nhập ghi chú"
                  onChange={onChange}
                  value={value}
                  suffixIcon={
                    <div
                      onClick={() => {
                        onChange("");
                      }}
                      className="bg-[#F65B5B] text-white cursor-pointer h-full flex justify-center items-center p-3"
                    >
                      Xóa
                    </div>
                  }
                  className="h-11  !py-0 !pr-0  !rounded"
                />
                <InputError error={errors.code?.message} />
              </div>
            )}
          />
        </div>
      ) : type === "DISCOUNT" ? (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              className={`col-span-1 border border-[#B2B2B2] p-2 rounded font-bold ${
                typeDiscount === "percent"
                  ? "bg-[#FF5C00] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setTypeDiscount("percent")}
            >
              %
            </button>
            <button
              onClick={() => setTypeDiscount("value")}
              className={`col-span-1 border border-[#B2B2B2] p-2 rounded font-bold ${
                typeDiscount === "value"
                  ? "bg-[#FF5C00] text-white"
                  : "bg-white text-black"
              }`}
            >
              $
            </button>
            <CustomInput
              type="text"
              value={
                typeDiscount === "percent" && valueDiscount > 100
                  ? 100
                  : valueDiscount
              }
              onChange={(e) => setValueDiscount(e)}
              wrapClassName="col-span-2"
              className="w-full border border-gray-300 rounded p-2 text-center"
            />
          </div>

          {/* Quick Discount Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[10, 20, 30, 40].map((value) => (
              <button
                key={value}
                onClick={() => setValueDiscount(`${value}`)}
                className="border border-[#B2B2B2] p-2 rounded font-bold hover:bg-[#F38820] hover:text-white"
              >
                {value}%
              </button>
            ))}
            {[7, 8, 9].map((value) => (
              <button
                key={value}
                onClick={() =>
                  setValueDiscount(`${valueDiscount}` + `${value}`)
                }
                className="border border-[#B2B2B2] p-2 rounded font-bold hover:bg-[#F38820] hover:text-white"
              >
                {value}
              </button>
            ))}

            <button
              onClick={() => setValueDiscount(valueDiscount?.slice(0, -1))}
              className="border border-[#B2B2B2] p-2 rounded font-bold hover:bg-[#F38820] hover:text-white"
            >
              <Image
                src={bxs_tag_x}
                className="translate-y-[4px]"
                alt="Delete"
              />
            </button>

            {[4, 5, 6, "C"].map((value) => (
              <button
                key={value}
                onClick={() => {
                  if (value === "C") {
                    setValueDiscount("");
                  } else {
                    setValueDiscount(`${valueDiscount}` + `${value}`);
                  }
                }}
                className="border border-[#B2B2B2] p-2 rounded font-bold hover:bg-[#F38820] hover:text-white"
              >
                {value}
              </button>
            ))}
          </div>

          {/* Numeric Input Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {[1, 2, 3, 0, "00", "."].map((value, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setValueDiscount(`${valueDiscount}` + `${value}`)
                  }
                  className="border border-[#B2B2B2] p-2 rounded font-bold hover:bg-[#F38820] hover:text-white"
                >
                  {value}
                </button>
              ))}
            </div>
            <CustomButton
              type="primary"
              className="!rounded-md !h-full"
              onClick={onSubmit}
            >
              Đồng ý
            </CustomButton>
          </div>
        </div>
      ) : type === "RETURN" ? (
        <div className="gap-3 flex flex-col">
          <div>
            <Label infoText="" label={t("Số lượng trả lại")} />
            <div className="flex justify-between items-center border-[1px] rounded-md border-[#d9d9d9] px-3 py-3">
              <div
                className={`flex justify-center items-center cursor-pointer text-xl rounded-md border-[1px] w-[20px] h-[20px]`}
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </div>
              <p>{quantity}</p>
              <div
                className={`flex justify-center items-center cursor-pointer text-xl rounded-md border-[1px] w-[20px] h-[20px]`}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </div>
            </div>
            <InputError error={errors.code?.message} />
          </div>

          <Controller
            name="note"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Label
                  infoText=""
                  label={
                    type === "CHANGE_PRICE"
                      ? "Ghi chú"
                      : type === "RETURN"
                      ? "Lý do trả lại"
                      : ""
                  }
                />
                <CustomInput
                  placeholder="Nhập ghi chú"
                  onChange={onChange}
                  value={value}
                  suffixIcon={
                    <div
                      onClick={() => {
                        onChange("");
                      }}
                      className="bg-[#F65B5B] text-white cursor-pointer h-full flex justify-center items-center p-3"
                    >
                      Xóa
                    </div>
                  }
                  className="h-11  !py-0 !pr-0  !rounded"
                />
                <InputError error={errors.code?.message} />
              </div>
            )}
          />
        </div>
      ) : (
        ""
      )}
    </CustomModal>
  );
};

export default ModalActionItem;

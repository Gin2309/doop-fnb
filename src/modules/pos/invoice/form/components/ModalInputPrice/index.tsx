import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import InputError from "@/components/InputError";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function ModalInputPrice({
  isOpen,
  onCancel,
  selectProduct,
  setSelectProduct,
  productChoosing,
  setProductChoosing,
}) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const {
    getValues,
    setValue,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const newProduct = {
      productName: selectProduct?.name,
      productType: selectProduct?.type,
      variantId: selectProduct.variants[0].id || 0,
      variantName: selectProduct.variants[0]?.name,
      variantPrice: data.itemPrice,
      itemPrice: data.itemPrice,
      note: data.note,
      quantity: quantity,
      groups: [],
    };

    const existingProductIndex = productChoosing.findIndex(
      (product) =>
        product.variantId === selectProduct.variants[0].id &&
        JSON.stringify(product.groups) === JSON.stringify(newProduct.groups)
    );

    if (existingProductIndex !== -1) {
      const updatedProductChoosing = [...productChoosing];
      if (selectProduct.type !== "TIME") {
        updatedProductChoosing[existingProductIndex].quantity += 1;
      }
      updatedProductChoosing[existingProductIndex].variantPrice =
        data.itemPrice;
      updatedProductChoosing[existingProductIndex].itemPrice = data.itemPrice;
      setProductChoosing(updatedProductChoosing);
    } else {
      setProductChoosing([...productChoosing, newProduct]);
    }

    onCancel();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={() => {
        onCancel();
      }}
      title={selectProduct?.name}
      width={1000}
      onSubmit={handleSubmit(onSubmit)}
      textOk="Thêm"
    >
      <div className="gap-3 flex flex-col">
        <div>
          <Controller
            name="itemPrice"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Label infoText="" label={t("Giá bán")} />
                <CustomInput
                  className={`suffix-icon h-11 !rounded`}
                  type="number"
                  placeholder="Nhập giá bán"
                  onChange={onChange}
                  value={value}
                />
                <InputError error={errors.code?.message} />
              </div>
            )}
          />
        </div>

        <div>
          <Label infoText="" label={t("Số lượng trả lại")} />
          <div className="flex justify-between items-center border-[1px] rounded-md border-[#d9d9d9] px-3 py-3">
            <div
              className={`flex justify-center items-center text-xl rounded-md border-[1px] w-[20px] h-[20px] cursor-pointer`}
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
    </CustomModal>
  );
}

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { CustomModal } from "@/components/CustomModal";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { Radio, Space } from "antd";
import { formatCurrency } from "@/utils";
import { RadioStyled } from "@/components/CustomRadio/styled";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import { CustomRadio } from "@/components/CustomRadio";
import Label from "@/components/CustomLabel";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomSwitch } from "@/components/CustomSwitch";

const ModalMoreOption = ({
  isOpen,
  onCancel,
  selectProduct,
  setSelectProduct,
  productChoosing,
  setProductChoosing,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSelections, setSelectedSelections] = useState<any>([]);
  const [selectTimeType, setSelectTimeType] = useState("now");
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [isAutoStop, setIsAutoStop] = useState(false);
  const [note, setNote] = useState("");
  const [variantPrices, setVariantPrices] = useState({});

  useEffect(() => {
    if (selectProduct?.variants?.length > 0) {
      setSelectedVariant(selectProduct.variants[0]);
    }
  }, [selectProduct]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  useEffect(() => {
    if (isOpen && selectProduct?.productSelectionGroupDtos?.length > 0) {
      const defaultSelections = selectProduct.productSelectionGroupDtos
        .flatMap(
          (group) =>
            group.selectionGroup?.selections?.filter(
              (selection) => selection.isDefault
            ) || []
        )
        .map((selection) => ({ ...selection, quantity: 1 }));

      setSelectedSelections(defaultSelections);
    }
  }, [isOpen, selectProduct]);

  const handleSelectionQuantityChange = (selectionId, delta) => {
    setSelectedSelections((prevSelections) =>
      prevSelections.map((item) =>
        item.id === selectionId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleInputQuantityChange = (selectionId, value) => {
    let numericValue = parseFloat(value);
    if (isNaN(numericValue)) numericValue = 1;
    numericValue = Math.max(1, numericValue);
    setSelectedSelections((prevSelections) =>
      prevSelections.map((item) =>
        item.id === selectionId ? { ...item, quantity: numericValue } : item
      )
    );
  };

  const handlePriceChange = (variantId, price) => {
    setVariantPrices((prev) => ({
      ...prev,
      [variantId]: price,
    }));
  };

  const handleSelectionChange = (selection) => {
    setSelectedSelections((prevSelections) => {
      const isAlreadySelected = prevSelections.some(
        (item) => item.id === selection.id
      );
      if (isAlreadySelected) {
        return prevSelections.filter((item) => item.id !== selection.id);
      }
      return [...prevSelections, { ...selection, quantity: 1 }];
    });
  };

  const onSubmit = () => {
    const newProduct = {
      productName: selectProduct?.name,
      productType: selectProduct?.type,
      variantId: selectedVariant.id || 0,
      productId: selectProduct?.id || 0,
      variantName: selectedVariant?.name,
      variantPrice: variantPrices[selectedVariant.id] || selectedVariant?.price, // Sử dụng giá từ variantPrices
      itemPrice: variantPrices[selectedVariant.id] || selectedVariant?.price,
      quantity: 1,
      note: note,
      groups: selectedSelections.map((item) => ({
        name: item?.name,
        selectionId: item?.id,
        quantity: item?.quantity || 1,
        price: item?.price,
      })),
      startTime:
        selectTimeType === "now" ? new Date().toISOString() : startTime,
      endTime: selectTimeType === "time" ? endTime : undefined,
      isAutoStop: selectTimeType === "time" ? isAutoStop : false,
    };

    const existingProductIndex = productChoosing.findIndex(
      (product) =>
        product.variantId === selectedVariant.id &&
        JSON.stringify(product.groups) === JSON.stringify(newProduct.groups)
    );

    if (existingProductIndex !== -1) {
      const updatedProductChoosing = [...productChoosing];
      if (selectProduct.type !== "TIME") {
        updatedProductChoosing[existingProductIndex].quantity += 1;
      }
      updatedProductChoosing[existingProductIndex].variantPrice =
        newProduct.itemPrice;
      updatedProductChoosing[existingProductIndex].itemPrice =
        newProduct.itemPrice;
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
        setSelectProduct(null);
        setSelectedVariant(null);
        setSelectedSelections([]);
      }}
      title="Lựa chọn thêm"
      width={1000}
      onSubmit={onSubmit}
      textOk="Thêm"
    >
      {selectProduct?.type === "TIME" ? (
        <div>
          <p className="font-bold text-xl">Thời gian</p>
          <CustomRadio
            direction="vertical"
            className="mt-3"
            options={[
              { value: "now", label: "Bắt đầu tính giờ từ hiện tại" },
              { value: "time", label: "Chọn thời gian" },
            ]}
            value={selectTimeType}
            onChange={(e) => setSelectTimeType(e)}
          />
          {selectTimeType === "time" && (
            <>
              <div className="my-4">
                <Label label="Thời gian bắt đầu" required />
                <CustomDatePicker
                  picker="datetime"
                  format="yyyy-MM-dd'T'HH:mm"
                  value={startTime}
                  onChange={(value) => {
                    const formattedDate =
                      dayjs(value).format("YYYY-MM-DDTHH:mm");
                    setStartTime(formattedDate);
                  }}
                />
                <p className="text-[#666666] mt-1 text-md">
                  Tự động tính giờ khi đến thời gian bắt đầu
                </p>
              </div>
              <div className="my-4">
                <Label label="Thời gian kết thúc" required />
                <CustomDatePicker
                  picker="datetime"
                  value={endTime}
                  format="yyyy-MM-dd'T'HH:mm"
                  onChange={(value) => {
                    const formattedDate =
                      dayjs(value).format("YYYY-MM-DDTHH:mm");
                    setEndTime(formattedDate);
                  }}
                />
                <p className="text-[#666666] mt-1 text-md">
                  Tự động thông báo khi kết thúc
                </p>
              </div>
              <div className="flex gap-2 items-center text-[#666666] mt-1 text-md">
                <CustomSwitch
                  checked={isAutoStop}
                  onChange={(checked) => setIsAutoStop(checked)}
                />
                <p>Dừng tính giờ khi đến thời gian kết thúc</p>
              </div>
            </>
          )}
          <div className="my-4">
            <Label label="Ghi chú" />
            <CustomTextarea
              placeholder="Nhập ghi chú"
              rows={4}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <>
          {selectProduct?.variants?.length > 0 && (
            <div className="mt-5">
              <p className="font-bold text-xl">Giá</p>
              <RadioStyled>
                <Radio.Group
                  className="w-full"
                  value={selectedVariant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                >
                  <Space direction="vertical" size={5} className="w-full">
                    {selectProduct?.variants?.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-10 border-b py-4 "
                        >
                          <Radio
                            value={item}
                            className="w-[20px] h-[20px] m-0"
                          />
                          <div className="flex justify-between w-full gap-20 items-center">
                            <p className="w-1/3">{item?.name}</p>
                            <div className="w-2/3 flex justify-between items-center">
                              <p className="text-[#3355FF]">
                                {selectProduct?.name}
                              </p>
                              {item?.isConfigPrice ? (
                                <div className="relative">
                                  <CustomInput
                                    type="number"
                                    wrapClassName="justify-end"
                                    className="text-end border-[1px] py-1 pr-5 w-2/3"
                                    value={variantPrices[item.id] || ""}
                                    onChange={(e) =>
                                      handlePriceChange(item.id, e)
                                    }
                                  />
                                  <p className="absolute top-[15%] right-2">
                                    đ
                                  </p>
                                </div>
                              ) : (
                                <p>{formatCurrency(item?.price)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </RadioStyled>
            </div>
          )}

          {selectProduct?.productSelectionGroupDtos?.length > 0 && (
            <div>
              {selectProduct?.productSelectionGroupDtos?.map((item) => (
                <div key={item.id} className="mt-5">
                  <p className="font-bold text-xl">
                    {item?.selectionGroup?.name}
                  </p>

                  {item.selectionGroup?.selections?.map((selection) => (
                    <div
                      key={selection.id}
                      className="flex gap-10 border-b py-4"
                    >
                      <CustomCheckbox
                        className="w-[20px] h-[20px]"
                        checked={selectedSelections.some(
                          (item) => item.id === selection.id
                        )}
                        onChange={() => handleSelectionChange(selection)}
                      />

                      <div className="flex justify-between w-full gap-20">
                        <p className="w-1/3">{selection.name}</p>
                        <div className="w-2/3 flex justify-between">
                          <p>{formatCurrency(selection.price)}</p>
                          <div className="flex">
                            <div
                              onClick={() =>
                                handleSelectionQuantityChange(selection.id, -1)
                              }
                              className={`flex justify-center items-center text-xl rounded-full border-[1px] w-[32px] h-[32px] ${
                                selectedSelections.some(
                                  (item) =>
                                    item.id === selection.id &&
                                    item.quantity > 1
                                )
                                  ? "border-[#E50000] text-[#E50000] cursor-pointer"
                                  : "border-[#B2B2B2] text-[#B2B2B2] cursor-not-allowed"
                              }`}
                            >
                              -
                            </div>
                            <CustomInput
                              // type="number"
                              value={
                                selectedSelections.find(
                                  (item) => item.id === selection.id
                                )?.quantity || 1
                              }
                              preChange={(value) => {
                                return !value || /^\d+(\.\d{0,2})?$/.test(`${value}`);
                              }}
                              onChange={(value: any) => {
                                handleInputQuantityChange(selection.id, value)
                              }}
                              className="text-xl w-[70px] border-none text-center"
                            />
                            <div
                              onClick={() =>
                                handleSelectionQuantityChange(selection.id, 1)
                              }
                              className="flex justify-center items-center text-xl rounded-full border-[#3355FF] border-[1px] w-[32px] h-[32px] text-[#3355FF] cursor-pointer"
                            >
                              +
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CustomModal>
  );
};

export default ModalMoreOption;

import React, { useEffect, useState } from "react";

import { CustomModal } from "@/components/CustomModal";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { message, Radio, Space } from "antd";
import { formatCurrency } from "@/utils";
import { RadioStyled } from "@/components/CustomRadio/styled";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import { CustomRadio } from "@/components/CustomRadio";
import Label from "@/components/CustomLabel";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomSwitch } from "@/components/CustomSwitch";
import { customMessage } from "@/utils/messageHelper";

import { useMutation, useQuery } from "@tanstack/react-query";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { getDetailProduct } from "@/api/product.service";
import { addSelection } from "@/api/current-bill-item.service";

const ModalEditOption = ({
  isOpen,
  onCancel,
  productEdit,
  productChoosing,
  setProductChoosing,
  billId,
  refetch,
}: {
  isOpen: any;
  onCancel: any;
  productEdit?: any;
  productChoosing: any;
  setProductChoosing: any;
  billId: any;
  refetch: any;
}) => {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSelections, setSelectedSelections] = useState<any>([]);
  const [selectTimeType, setSelectTimeType] = useState("now");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAutoStop, setIsAutoStop] = useState(false);
  const [note, setNote] = useState("");
  const [variantPrices, setVariantPrices] = useState({});

  const branch = useRecoilValue(branchStateSession);

  const { data: productDetailData } = useQuery(
    ["PRODUCT_DETAIL_POS", productEdit?.productId, branch?.id],
    () => getDetailProduct(Number(productEdit?.productId), Number(branch?.id)),
    { enabled: !!productEdit?.productId && !!branch.id }
  );

  const productDetail = productDetailData?.data;

  const { mutate: addSelectionMutation } = useMutation(
    ({ id, data }: { id: any; data: any }) => addSelection(id, data),
    {
      onSuccess: async () => {
        customMessage.success("Thao tác thành công");
        refetch();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  useEffect(() => {
    if (productDetail?.variants?.length > 0) {
      const defaultVariant =
        productDetail.variants.find(
          (variant) => variant.id === productEdit?.variantId
        ) || productDetail.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [productDetail, productEdit]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  useEffect(() => {
    if (isOpen && productDetail?.productSelectionGroupDtos?.length > 0) {
      const defaultSelections = productDetail.productSelectionGroupDtos
        .flatMap(
          (group) =>
            group.selectionGroup?.selections?.filter(
              (selection) => selection.isDefault
            ) || []
        )
        .map((selection) => ({ ...selection, quantity: 1 }));

      setSelectedSelections(defaultSelections);
    }
  }, [isOpen, productDetail]);

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
    const numericValue = Math.max(1, parseInt(value) || 1);
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
      items: [
        {
          variantId: selectedVariant.id || 0,
          quantity: 1,
          itemPrice:
            variantPrices[selectedVariant.id] || selectedVariant?.price || 0,
          endTime: selectTimeType === "time" ? endTime : undefined,
          startTime:
            selectTimeType === "now" ? new Date().toISOString() : startTime,
          note: note,
          isAutoStop: selectTimeType === "time" ? isAutoStop : false,
          groups: selectedSelections.map((item) => ({
            selectionId: item?.id || 0,
            quantity: item?.quantity || 0,
          })),
        },
      ],
      branchId: branch?.id,
    };

    addSelectionMutation({ id: billId, data: newProduct });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={() => {
        onCancel();
        setSelectedVariant(null);
        setSelectedSelections([]);
      }}
      title={productEdit?.productName}
      width={1000}
      onSubmit={onSubmit}
      textOk="Thêm"
    >
      {productDetail?.type === "TIME" ? (
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
                  format="yyyy-MM-dd HH:mm"
                  value={startTime}
                  onChange={(value) => {
                    setStartTime(value);
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
                  format="yyyy-MM-dd HH:mm"
                  onChange={(value) => setEndTime(value)}
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
          {productDetail?.variants?.length > 0 && (
            <div className="mt-5">
              <p className="font-bold text-xl">Giá</p>
              <RadioStyled>
                <Radio.Group
                  className="w-full"
                  value={selectedVariant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                >
                  <Space direction="vertical" size={5} className="w-full">
                    {productDetail?.variants?.map((item) => {
                      const isSelected = item.id === productEdit?.variantId;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-10 border-b py-4 "
                        >
                          <Radio
                            value={item}
                            className="w-[20px] h-[20px] m-0"
                            checked={isSelected}
                          />
                          <div className="flex justify-between w-full gap-20 items-center">
                            <p className="w-1/3">{item?.name}</p>
                            <div className="w-2/3 flex justify-between items-center">
                              <p className="text-[#3355FF]">
                                {isSelected
                                  ? productEdit?.productName
                                  : productDetail?.name}
                              </p>
                              <p>{formatCurrency(item?.price)}</p>
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

          {productDetail?.productSelectionGroupDtos?.length > 0 && (
            <div>
              {productDetail?.productSelectionGroupDtos?.map((group) => (
                <div key={group.id} className="mt-5">
                  <p className="font-bold text-xl">
                    {group?.selectionGroup?.name}
                  </p>

                  {group.selectionGroup?.selections?.map((selection) => {
                    return (
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
                                  handleSelectionQuantityChange(
                                    selection.id,
                                    -1
                                  )
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
                                type="number"
                                value={
                                  selectedSelections.find(
                                    (item) => item.id === selection.id
                                  )?.quantity || 1
                                }
                                onChange={(value: any) =>
                                  handleInputQuantityChange(selection.id, value)
                                }
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
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CustomModal>
  );
};

export default ModalEditOption;

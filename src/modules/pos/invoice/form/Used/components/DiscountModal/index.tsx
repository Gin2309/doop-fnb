import React, { useCallback, useState } from "react";

import { CustomModal } from "@/components/CustomModal";
import { CustomButton } from "@/components/CustomButton";
import { CustomRadio } from "@/components/CustomRadio";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { formatMoney } from "@/helpers";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getVouchers } from "@/api/voucher.service";
import { addDiscountItemCurrentBill, ArgsAddDiscountItemCurrentBill } from "@/api/current-bill-item.service";
import { Form, Input, message, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { formatCurrency } from "@/utils";
import { CustomInput } from "@/components/CustomInput";

const { Option } = Select;

type FormDiscount = {
  value: number;
};

const DiscountModal = ({
  isOpen,
  onCancel,
  currentBillId,
  refetch,
}: {
  isOpen: boolean;
  onCancel: () => void;
  currentBillId: number;
  refetch?: any;
}) => {
    const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm<FormDiscount>({
    defaultValues: {
        value: 0
    }
  });
  const [typeDiscount, setTypeDiscount] = useState<"value" | "percent">("percent");

  const branch = useRecoilValue(branchStateSession);
  const { mutate: addMutation, isLoading } = useMutation(
    (data: ArgsAddDiscountItemCurrentBill) => addDiscountItemCurrentBill(data),
    {
      onSuccess: () => {
        message.success("Thành công!");
        onCancel();
        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = (data: FormDiscount) => {
    addMutation({
        currentBillId,
        type: "DISCOUNT",
        branchId: branch.id,
        percent: typeDiscount === "percent" ? data.value : undefined,
        value: typeDiscount === "value" ? data.value : undefined
    });
  };



  const selectBefore = useCallback(() => {
    return (
        <Select value={typeDiscount} onChange={(value) => {
            setTypeDiscount(value)
            setValue("value", 0)
        }} style={{ width: 100 }}>
            <Option value="percent">Percent</Option>
            <Option value="value">Value</Option>
        </Select>
    )
  }, [typeDiscount])

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Chiết Khấu"
      width={800}
    //   onSubmit={onSubmit}
      customFooter
    >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item label="Nhập giá trị:" validateStatus={errors.value ? "error" : ""} help={errors.value?.message}>
                <Controller
                    name="value"
                    control={control}
                    rules={{
                        required: "Vui lòng nhập đầy đủ thông tin!",
                        min: { value: 0.1, message: "Số lượng phải lớn hơn 0!" },
                    }}
                    render={({ field }) => typeDiscount === "percent" ? <Input 
                        {...field}
                        onChange={(e) => {
                            const value = +e.target.value;
                            field.onChange(value);
                        }}
                        type="number" 
                        step="0.01"
                        placeholder="Nhập phần trăm chiết khấu"
                        addonBefore={selectBefore()} 
                        addonAfter="%"
                        style={{ 
                            width: "100%", maxWidth: 500
                        }}
                    /> : <CustomInput
                        {...field}
                        onChange={(value) => {
                            field.onChange(+value);
                        }}
                        type="number" 
                        placeholder="Nhập số tiền chiết khấu"
                        addonBefore={selectBefore()} 
                        addonAfter="VNĐ" 
                        style={{ 
                            width: "100%", maxWidth: 500
                        }}
                    />}
                />
            </Form.Item>
        </Form>
      <div className="flex justify-end w-full gap-4 pt-6">
        <CustomButton
          isLoading={isLoading}
          onClick={handleSubmit(onSubmit)}
          className="!h-11 !w-[120px]"
          type="primary"
        >
          Xác nhận
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default DiscountModal;

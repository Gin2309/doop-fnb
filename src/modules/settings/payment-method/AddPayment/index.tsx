import React from "react";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomInput } from "@/components/CustomInput";
import { CustomButton } from "@/components/CustomButton";

const options = [
  {
    id: 1,
    label: "Tiền mặt",
  },
  {
    id: 2,
    label: "Chuyển khoản",
  },
  {
    id: 3,
    label: "Thanh toán thẻ",
  },
  {
    id: 4,
    label: "Ví điện tử",
  },
];

const AddPayment = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm phương thức thanh toán"
      onSubmit={() => {}}
      customFooter
    >
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-[16px] text-[#1a1a1a] font-medium">
          Thông tin đăng ký
        </h1>

        <div>
          <Label infoText="" label="Tên phương thức" />
          <CustomInput
            placeholder="Nhập tên phương thức"
            onChange={() => {}}
            className="w-full h-11"
          />
        </div>

        <div>
          <Label infoText="" label="Chọn loại PTTT" />
          <CustomSelect
            placeholder="Loại phương thức "
            options={options.map((item) => ({
              value: item.id,
              label: item.label,
            }))}
            className="w-full h-11"
            onChange={() => {}}
            showSearch
          />
        </div>
      </div>

      <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
        <CustomButton
          outline={true}
          className="!h-11 !w-[120px]"
          type="original"
          onClick={onCancel}
        >
          Hủy bỏ
        </CustomButton>
        <CustomButton
          className="!h-11 !w-[120px]"
          onClick={() => {}}
          type="primary"
        >
          Thêm
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default AddPayment;

import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";

const CancelTable = ({
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
      title="Hủy đơn đặt bàn"
      width={650}
      textOk="Xác nhận hủy"
      btnCancel={true}
      typeOk={"danger"}
    >
      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <Label label="Lý do hủy" />
          <CustomRadio
            direction="vertical"
            options={[
              { value: 1, label: " Khách yêu cầu hủy" },
              { value: 2, label: "Lý do khác" },
            ]}
          />
          <CustomInput
            onChange={(value: any) => console.log(value)}
            className="h-11  bg-[#F2F2F2]"
            placeholder="Nhập lý do"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label label="Lý do hủy" />
          <CustomRadio
            direction="vertical"
            options={[
              { value: 1, label: " Khách yêu cầu hủy" },
              { value: 2, label: "Lý do khác" },
            ]}
          />
          <CustomInput
            onChange={(value: any) => console.log(value)}
            className="h-11  bg-[#F2F2F2]"
            placeholder="Nhập số tiền"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default CancelTable;

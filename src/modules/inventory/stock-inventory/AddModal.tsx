import Image from "next/image";
import { useTranslation } from "react-i18next";

import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";

const AddModal = ({
  isOpen,
  onCancel,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();

  const unitGroup = {
    data: {
      items: [
        { id: "1", name: "Lốc" },
        { id: "2", name: "Vỉ" },
      ],
    },
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      customFooter
      title={t("addCustomer")}
      width={800}
    >
      <div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mb-6">
          <div>
            <Label infoText="" label={t("ingredientName")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập tên nguyên liệu"
            />
          </div>

          <div>
            <Label infoText="" label={t("unit")} />
            <CustomSelect
              onChange={(value) => console.log(value)}
              options={unitGroup?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              showSearch={true}
              className="suffix-icon h-11 !rounded"
              placeholder="Chọn đơn vị"
            />
          </div>

          <div>
            <Label infoText="" label={t("initialQuantity")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập số lượng ban đầu"
            />
          </div>

          <div>
            <Label infoText="" label={t("minimumQuantity")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập số lượng tối thiểu"
            />
          </div>
        </div>

        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            wrapClassName="w-[120px]"
            type="original"
            onClick={onCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            wrapClassName="w-[120px]"
            onClick={onSubmit}
            type="primary"
          >
            {t("save")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddModal;

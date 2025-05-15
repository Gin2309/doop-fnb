import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Input } from "antd";
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
  const { TextArea } = Input;

  const branchGroup = {
    data: {
      items: [
        { id: "1", name: "Cộng cà phê Lê Văn Lương" },
        { id: "2", name: "Gemini Coffee Hàm Nghi" },
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
      title={t("addPartner")}
      width={800}
    >
      <div>
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mb-6">
          <div>
            <Label infoText="" label={t("partnerCode")} required />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập mã đối tác"
            />
          </div>

          <div>
            <Label infoText="" label={t("partnerName")} required />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập tên đối tác"
            />
          </div>

          <div>
            <Label infoText="" label={t("taxCode")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập mã số thuế"
            />
          </div>

          <div>
            <Label infoText="" label={t("phoneNumber")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập số điện thoại đối tác"
            />
          </div>

          <div>
            <Label infoText="" label={t("branch")} />
            <CustomSelect
              onChange={(value) => console.log(value)}
              options={branchGroup?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              showSearch={true}
              className="suffix-icon h-11 !rounded"
              placeholder="Chọn chi nhánh"
            />
          </div>

          <div>
            <Label infoText="" label={t("address")} />
            <CustomInput
              onChange={(value: any) => console.log(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập địa chỉ cụ thể"
            />
          </div>

          <div className="col-span-2 ">
            <Label infoText="" label={t("partnerDescription")} />
            <TextArea
              rows={4}
              placeholder="Nhập mô tả đối tác"
              style={{ borderRadius: "4px" }}
              // maxLength={100}
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
            {t("cancel")}
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 !w-[120px]"
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

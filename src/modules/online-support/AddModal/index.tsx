import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";

import CloseCircleGrayIcon from "@/assets/close.svg";
import SupportImg from "@/assets/images/Support.png";

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

  const branchGroup = {
    data: {
      items: [
        { id: "1", name: "Doop Cafe LVL" },
        { id: "2", name: "Cộng Cafe Mỹ Đình" },
      ],
    },
  };

  const ProblemGroup = {
    data: {
      items: [
        { id: "1", name: "Lỗi phần mềm" },
        { id: "2", name: "Lỗi login" },
      ],
    },
  };

  const SupoportMethodGroup = {
    data: {
      items: [
        { id: "1", name: "Gọi điện" },
        { id: "2", name: "Gửi mail" },
      ],
    },
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      customFooter
      width={696}
    >
      <div>
        <div className="mb-6">
          <h1 className="text-center uppercase font-semibold text-[20px] text-[#1A1A1A]">
            {t("sendSupport")}
          </h1>
          <div className="flex justify-center">
            <Image src={SupportImg} />
          </div>
          <div className="mt-2 grid md:grid-cols-2 gap-4">
            <div>
              <Label infoText="" label={t("branch")} />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={branchGroup?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                value="1"
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn chi nhánh"
              />
            </div>

            <div>
              <Label infoText="" label={t("problem")} />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={ProblemGroup?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                value="1"
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn vấn đề bạn gặp cần hỗ trợ"
              />
            </div>

            <div className="md:col-span-2">
              <Label infoText="" label={t("title")} />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập tiêu đề hỗ trợ"
              />
            </div>

            <div className="md:col-span-2">
              <Label infoText="" label={t("description")} />
              <CustomTextarea placeholder="Nhập nội dung hỗ trợ" />
            </div>

            <div className="md:col-span-2">
              <Label infoText="" label={t("supportMethod")} />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={SupoportMethodGroup?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                value="1"
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn phương thức hỗ trợ"
              />
            </div>
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
            {t("sendSupport")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddModal;

import Image from "next/image";
import { useTranslation } from "react-i18next";
import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import RemoveIcon from "@/assets/Remove.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const DeleteModal = ({
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

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      customFooter
      width={423}
    >
      <div className="flex flex-col items-center justify-start gap-6 text-[#1C1C28]">
        <div className="w-[100%]">
          <div className="w-[46px] h-[46px] bg-[#FFF5F4] flex items-center justify-center rounded-md">
            <Image src={RemoveIcon} height={32} width={32} />
          </div>
        </div>
        <div className="flex text-xl font-semibold">
          Bạn có chắc chắn muốn xóa tài khoản?
        </div>
        <p>
          Sau khi xóa tài khoản, dữ liệu này sẽ không còn tồn tại trên hệ thống.
        </p>

        <div className="flex justify-start w-[100%] gap-[15px]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            onClick={onCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 !w-[120px]"
            onClick={onSubmit}
          >
            {isLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 18 }}
                    spin
                    rev={undefined}
                  />
                }
              />
            ) : (
              t("delete")
            )}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteModal;

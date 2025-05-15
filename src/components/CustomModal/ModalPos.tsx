import Image from "next/image";

import CloseCircleGrayIcon from "@/assets/closeCircleGrayIcon.svg";
import BoyImg from "@/assets/images/boy 1.png";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";

const ModalPos = ({
  isOpen,
  onCancel,
  onSuccess,
  content,
  isLoading,
  title,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  title: string;
  content: string;
  isLoading?: boolean;
}) => {
  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={500}
    >
      <div className="flex flex-col items-center justify-center gap-6 text-[#1C1C28]">
        <div className="text-xl font-semibold">{title}</div>
        <div className="h-[1px] w-full bg-[#C7C9D9]" />
        <Image src={BoyImg} alt="" />
        <div className="flex text-center text-lg">{content}</div>

        <div className="grid w-full grid-cols-2 gap-4">
          <CustomButton
            outline={true}
            className="!h-11 w-full"
            onClick={onCancel}
          >
            Hủy
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 w-full"
            onClick={onSuccess}
          >
            Xác nhận
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalPos;

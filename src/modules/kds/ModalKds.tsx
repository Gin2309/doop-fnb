import Image from "next/image";
import KdsStatus from "@/assets/kds-status.svg";
import styled from "styled-components";
import { Modal } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "next/router";

const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    width: 500px;
  }

  .ant-modal-body {
    padding: 0;
  }
`;

export default function CustomModalChangeStatus({
  title,
  content,
  isVisible,
  setIsVisible,
  onSubmit,
  action,
}: {
  title: string;
  content: string;
  isVisible: boolean;
  setIsVisible: any;
  onSubmit?: any;
  setIsOpenAddEmployee?: any;
  titleSubmit?: string;
  action: string;
}) {
  if (!isVisible) return null;

  const router = useRouter();

  return (
    <CustomModal
      open={isVisible}
      onCancel={() => {
        setIsVisible(false);
      }}
      centered
      maskClosable={false}
      footer={null}
    >
      <div className="px-5 py-10 flex justify-center text-center flex-col gap-2">
        <div className="py-4">
          <Image src={KdsStatus} alt="" />
        </div>
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm mb-3">{content}</p>

        <div className="flex justify-between gap-5">
          <div className="flex-1">
            <CustomButton
              type="original"
              className="px-10"
              onClick={() => setIsVisible(false)}
            >
              Thoát
            </CustomButton>
          </div>
          <div className="flex-1">
            <CustomButton
              type="danger"
              className="px-10"
              onClick={() => {
                if (onSubmit) onSubmit();
              }}
            >
              {action}
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}

import Image from "next/image";
import SuccessNoti from "@/assets/successNoti.svg";
import warnNoti from "@/assets/warnNoti.svg";
import failNoti from "@/assets/failNoti.svg";
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

export default function ModalChangeStatus({
  title,
  content,
  type,
  isVisible,
  setIsVisible,
  onSubmit,
  setIsOpenAddEmployee,
  titleSubmit,
}: {
  title: string;
  content: string;
  type: "success" | "warn" | "fail";
  isVisible: boolean;
  setIsVisible: any;
  onSubmit?: any;
  setIsOpenAddEmployee?: any;
  titleSubmit?: string;
}) {
  if (!isVisible) return null;

  const router = useRouter();

  return (
    <CustomModal
      open={isVisible}
      onCancel={() => {
        setIsVisible(false);
        type === "success" && router.back();
      }}
      centered
      footer={null}
    >
      <div className="p-10 flex justify-center text-center flex-col gap-2">
        <div className="py-4">
          <Image
            src={
              type === "success"
                ? SuccessNoti
                : type === "warn"
                ? warnNoti
                : failNoti
            }
            alt={`${type} notification`}
          />
        </div>
        <p className="text-xl font-semibold">{title}</p>
        <p className="text-sm">{content}</p>

        {type === "success" && (
          <div className="flex gap-5 justify-center mt-2">
            <CustomButton
              type="original"
              className="px-10"
              onClick={() => setIsVisible(false)}
            >
              Hủy
            </CustomButton>
            <CustomButton type="primary" className="px-10" onClick={onSubmit}>
              Xác nhận
            </CustomButton>
          </div>
        )}
        {type === "warn" && (
          <div className="flex gap-5 justify-center mt-2">
            <CustomButton
              type="original"
              className="px-10"
              onClick={() => setIsVisible(false)}
            >
              Hủy
            </CustomButton>
            <CustomButton type="danger" className="px-10" onClick={onSubmit}>
              {titleSubmit ? titleSubmit : "Xóa"}
            </CustomButton>
          </div>
        )}
      </div>
    </CustomModal>
  );
}

import Image from "next/image";
import SuccessNoti from "@/assets/successNoti.svg";
import warnNoti from "@/assets/warnNoti.svg";
import failNoti from "@/assets/failNoti.svg";
import styled from "styled-components";
import { Modal } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { useEffect } from "react";

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

export type CustomNotiActionProps = {
  title?: string;
  content?: string;
  type: "success" | "warn" | "fail";
  isVisible: boolean;
  setIsVisible?: any;
  onSubmit?: any;
  textCancel?: string;
  textOk?: string;
  onCancel?: () => void;
}

export default function CustomNotiAction({
  title = "",
  content = "",
  type,
  isVisible,
  setIsVisible,
  onSubmit,
  textCancel = "Hủy",
  textOk = "Xóa",
  onCancel = () => { },
}: CustomNotiActionProps) {
  return (
    <CustomModal
      open={isVisible}
      onCancel={() => {
        if(!!setIsVisible) setIsVisible(false);
        if(!!onCancel) onCancel();
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
        {type === "warn" && (
          <div className="flex gap-5 justify-center mt-2">
            <CustomButton type="original" className="px-10" onClick={onCancel}>
              {textCancel}
            </CustomButton>
            <CustomButton type="danger" className="px-10" onClick={onSubmit}>
              {textOk}
            </CustomButton>
          </div>
        )}
      </div>
    </CustomModal>
  );
}

import { Modal } from "antd";
import cx from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { CustomButton } from "../CustomButton";
import styled from "styled-components";

type SelectProps = ComponentProps<typeof Modal>;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 800px;
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
  }

  .ant-modal-header {
    background-color: rgba(255, 244, 240, 1);
    border-bottom: none;
    padding: 16px;
    border-radius: 8px 8px 0 0;
  }

  .ant-modal-body {
    padding: 24px;
  }
`;

export function CustomModal({
  title,
  isOpen,
  onCancel,
  onSubmit,
  children,
  width,
  customFooter,
  textCancel,
  textOk,
  btnCancel,
  typeOk,
  className,
  isLoading,
  forceRender,
  ...rest
}: {
  title?: string | ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  children: any;
  width?: number;
  customFooter?: boolean;
  textCancel?: string;
  textOk?: string;
  typeOk?: any;
  btnCancel?: boolean;
  className?: string;
  isLoading?: boolean;
  forceRender?: boolean;
} & SelectProps) {
  return (
    <StyledModal
      title={title}
      width={width}
      open={isOpen}
      className={cx("custom-modal", className)}
      onCancel={onCancel}
      centered
      forceRender={forceRender}
      maskClosable={false}
      footer={
        customFooter
          ? null
          : [
              <div className="flex justify-end gap-[10px] border-t-[1px] w-full px-[15px] h-[72px] items-center">
                {btnCancel ? null : (
                  <CustomButton
                    type="original"
                    wrapClassName="w-[100px]"
                    onClick={onCancel}
                  >
                    {textCancel || "Hủy bỏ"}
                  </CustomButton>
                )}

                <CustomButton
                  type={typeOk || "primary"}
                  wrapClassName="p-3"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {textOk || "Xong"}
                </CustomButton>
              </div>,
            ]
      }
      {...rest}
    >
      {children}
    </StyledModal>
  );
}

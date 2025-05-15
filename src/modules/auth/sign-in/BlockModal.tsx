import { Modal } from "antd";
import Image from "next/image";
import BlockAuth from "@/assets/images/block.png";
import styled from "styled-components";

const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    height: 280px;
    width: 500px;
  }

  .ant-modal-body {
    padding: 0;
  }
`;

const BlockModal = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  return (
    <CustomModal open={isOpen} onCancel={onCancel} centered footer={null}>
      <div className="mt-4">
        <Image
          src={BlockAuth}
          alt="Banner"
          width={120}
          height={120}
          priority
          className="mx-auto "
        />
      </div>
      <p className="font-bold py-3 text-[18px]">
        Tài khoản của quý khách đang bị khóa
      </p>
      <p>
        Vui lòng liên hệ holline <strong>091.858.1819</strong> để được hỗ trợ
      </p>
    </CustomModal>
  );
};

export default BlockModal;

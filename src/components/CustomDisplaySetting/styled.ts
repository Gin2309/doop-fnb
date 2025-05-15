import styled from "styled-components";
import { Typography, Modal, Button, Checkbox } from "antd";

export const CustomTypo: any = styled(Typography)`
  color: #ff5c00;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const CustomCheckbox = styled(Checkbox)`
  background-color: #ff5c00 !important;
  border-color: #ff5c00 !important;
`;

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    background-color: #fff;
    border-radius: 12px;
    padding: 0;
    width: 650px;
  }

  .ant-modal-header {
    background-color: #fff4f0;
    border-radius: 12px 12px 0 0;
    padding: 20px 24px;
  }

  .ant-modal-title {
    color: #1a1a1a;
    font-size: 20px;
  }

  .ant-modal-footer {
    border-top: 1px solid #e5e5e5;
    padding: 10px 20px;
  }

  .ant-modal-body {
    padding: 24px;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ff5c00 !important;
    border-color: #ff5c00 !important;
  }

  .ant-checkbox-input {
    &:hover {
      border-color: #ff5c00 !important;
      background-color: #ff5c00 !important;
    }
  }

  .ant-modal {
    transform: translateY(-50%) !important;
    top: 50% !important;
  }
`;

export const SaveButton = styled(Button)`
  background: linear-gradient(45deg, #f38820, #ff5c00);
  border-radius: 50px;
  width: 100px;
  color: white;
  border: none;
  height: 40px;

  &:hover {
    background: linear-gradient(45deg, #ff5c00, #f38820);
    color: white !important;
  }
`;

export const CancelButton = styled(Button)`
  border-radius: 50px;
  width: 100px;
  height: 40px;
  border: 1px solid #d7dfe9;

  &:hover {
    color: #ff5c00 !important;
    border: 1px solid #ff5c00 !important;
  }
`;

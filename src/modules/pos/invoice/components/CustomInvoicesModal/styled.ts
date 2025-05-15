import styled from "styled-components";
import { Modal, Button } from "antd";

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    background-color: #fff;
    border-radius: 12px;
    padding: 0;
    width: 650px;
  }

  .ant-modal {
    top: 50% !important;
    transform: translateY(-50%) !important;
  }

  .ant-modal-header {
    background-color: #fff4f0;
    border-radius: 12px 12px 0 0;
    padding: 20px 24px;
  }

  .ant-modal-header p {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 20px;
    margin-top: 15px;
  }

  .ant-modal-footer {
    border-top: 1px solid #e5e5e5;
    padding: 10px 20px;
  }

  .ant-modal-body {
    padding: 20px 24px;
    gap: 20px;
    display: flex;
    flex-direction: column;
  }

  .ant-modal-body .container {
    width: 100%;
    gap: 16px;
    display: flex;
    flex-direction: column;
  }

  .ant-modal-body .header-title {
    padding: 4px 8px;
    background-color: #f5f7fe;
    font-weight: 600;
  }

  .ant-modal-body h1 {
    text-transform: uppercase;
    color: #1a1a1a;
  }

  .body-container p {
    color: #333333;
  }

  .body-container {
    gap: 16px;
    display: flex;
    flex-direction: column;
  }

  .body-container .price {
    font-weight: 500;
  }

  .body-container .expand {
    margin-right: 5px;
  }

  .body-container .expand2 {
    margin: 0 5px;
  }

  .container {
    margin-left: 8px;
    margin-right: 8px;
  }

  .small-container {
    display: flex;
  }

  // tag css
  .ant-tag-success {
    background: #00993326;
    color: #009933;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
    margin-inline-end: 0px;
  }

  .ant-tag-warning {
    background: #fff9eb;
    color: #f0b433;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
    margin-inline-end: 0px;
  }

  .ant-tag-error {
    background: #ec24241a;
    color: #e50000;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
    margin-inline-end: 0px;
  }

  .ant-tag-processing {
    background: #3355ff1a;
    color: #3355ff;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 14px;
    margin-inline-end: 0px;
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

import styled, { css } from "styled-components";
import { Upload } from "antd";

export const UploadStyled = styled(Upload)<{ uploadType: string }>`
  .ant-upload {
    ${({ uploadType }) =>
      uploadType === "type-1" &&
      css`
        height: 140px !important;
        width: 150px !important;
        background: #fff;
        border-radius: 8px;
        border-bottom: 1px dashed #d9d9d9;
        border-right: 1px dashed #d9d9d9;
        transition: border-color 0.3s ease;

        &:hover {
          border-bottom: 1px dashed #007bff;
          border-right: 1px dashed #007bff;
        }
      `}

    ${({ uploadType }) =>
      uploadType === "type-2" &&
      css`
        height: 300px !important;
        width: 100% !important;
        background: #fff;
        border-radius: 8px;
        border-bottom: 1px dashed #d9d9d9;
        transition: border-color 0.3s ease;

        &:hover {
          border-bottom: 1px dashed #007bff;
        }
      `}
  }

  .ant-upload-list-item-done {
    ${({ uploadType }) =>
      uploadType === "type-2" &&
      css`
        height: 300px !important;
      `}
  }
`;

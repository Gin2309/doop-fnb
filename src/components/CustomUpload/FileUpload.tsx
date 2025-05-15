import type { UploadProps } from "antd";
import { Button, message, Upload } from "antd";
import Image from "next/image";
import FileIcon from "@/assets/FileArrowUp.svg";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useState } from "react";

const StyledUpload = styled(Upload)`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  height: 44px;
  width: 100%;
  &:hover {
    background-color: #e6e6e6;
    border-color: #bfbfbf;
  }

  .ant-upload {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-upload img {
    width: 24px;
    height: 24px;
    display: none;
  }

  .ant-upload-icon {
    display: none !important;
  }

  .ant-upload-list-item-name {
    color: #333333 !important;
    margin-top: -8px;
  }

  .placeholder {
    margin-left: 10px;
    color: #333333;
    font-size: 14px;
    pointer-events: none;
  }
  .ant-upload-list {
    flex: 1;
  }
`;

const FileUpload: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);

  const defaultPlaceholder = placeholder || t("uploadFile");

  const props: UploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      setFileList(info.fileList); // Update fileList state

      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <StyledUpload {...props}>
      <Image src={FileIcon} alt="Upload" />
      {fileList.length === 0 && (
        <div className="placeholder">{defaultPlaceholder}</div>
      )}
    </StyledUpload>
  );
};

export default FileUpload;

import { useEffect, useState } from "react";
import Img from "next/image";
import { message } from "antd";
import { UploadFile, RcFile, UploadProps } from "antd/es/upload/interface";
import { uploadSingleFile } from "@/api/upload.service";
import { UploadStyled } from "./styled";
import PhotographIcon from "@/assets/photograph.svg";
import { isColorAvatar, isIconAvatar } from "@/utils";

const CustomUpload = ({
  onChangeValue,
  value,
  type,
  title,
  children,
  className,
}: {
  onChangeValue?: (url: string) => void;
  value?: any | null;
  type: string;
  title?: string | null;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [file, setFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (value && !isColorAvatar(value) && !isIconAvatar(value)) {
      setFile({
        uid: Date.now().toString(),
        name: "Ảnh đã tải lên",
        status: "done",
        url: value,
      });
    } else {
      setFile(null);
    }
  }, [value]);

  const props: UploadProps = {
    async onChange(info: any) {
      const { file: newFile } = info;

      if (newFile.size > 2 * 1024 * 1024) {
        message.error("Dung lượng file không được lớn hơn 2MB");
        return;
      }

      if (!file) {
        try {
          const res = await uploadSingleFile(newFile);
          if (res?.data) {
            if (onChangeValue) {
              onChangeValue(res?.data);
            }

            setFile({
              uid: newFile.uid,
              name: newFile.name,
              status: "done",
              url: res?.data,
            });
          }
        } catch (error) {
          console.error("Error uploading file: ", error);
          message.error("Tải file lên thất bại, vui lòng thử lại.");
        }
      }
    },
    onRemove() {
      setFile(null);
      if (onChangeValue) {
        onChangeValue("");
      }
    },
    beforeUpload: () => false,
    accept: "image/*",
    listType: "picture-card",
    maxCount: 1,
    multiple: false,
  };

  return (
    <UploadStyled {...props} fileList={file ? [file] : []} uploadType={type}>
      {!file && (
        <div
          className={`${className} flex flex-col justify-center items-center font-semibold`}
        >
          <Img src={PhotographIcon} alt="" />
          <p className="text-custom-orange">
            Tải ảnh lên <span className="text-[#6F727A]">hoặc kéo và thả</span>{" "}
          </p>
          <span className="text-[#666666] font-light">
            PNG, JPG, GIF up to 2MB
          </span>
          {title && <span className="text-[#6F727A]">{title}</span>}
        </div>
      )}
      {children}
    </UploadStyled>
  );
};

export default CustomUpload;

import { useEffect, useState } from "react";
import Img from "next/image";
import { message } from "antd";
import { UploadFile, UploadProps } from "antd/es/upload/interface";
import { uploadSingleFile } from "@/api/upload.service";
import { UploadStyled } from "./styled";
import PhotographIcon from "@/assets/photograph.svg";

const CustomUpload2 = ({
  onChangeValue,
  value,
  type,
  disable = false,
}: {
  onChangeValue?: (url: string) => void;
  value?: string | null;
  type: string;
  disable?: boolean;
}) => {
  const [file, setFile] = useState<UploadFile | null>(null);

  useEffect(() => {
    if (value) {
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
    onRemove: () => {
      if (!disable) {
        setFile(null);
        if (onChangeValue) {
          onChangeValue("");
        }
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
        <div className="flex flex-col justify-center items-center font-semibold">
          <Img src={PhotographIcon} alt="" />
          <span className="text-custom-orange">Tải ảnh lên</span>
          <span className="text-[#6F727A]">hoặc kéo và thả</span>
        </div>
      )}
    </UploadStyled>
  );
};

export default CustomUpload2;

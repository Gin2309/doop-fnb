import { message, Spin } from "antd";
import Image from "next/image";
import MessageSuccessIcon from "@/assets/MessageSuccessIcon.svg";
import { LoadingOutlined } from "@ant-design/icons";

export const customMessage = {
  loading: (content: string, key: string) => {
    message.open({
      key,
      content: (
        <div className="flex items-center border-[#1890FF] border-[1px] p-2 bg-[#E6F7FF] text-[#1890FF] font-semibold rounded-3xl">
          <Spin
            indicator={<LoadingOutlined spin rev={true} />}
            size="small"
            className="mr-2"
          />
          <span>{content}</span>
        </div>
      ),
      duration: 0,
      className: "flex justify-end",
    });
  },
  success: (content: string) => {
    message.open({
      content: (
        <div className="flex items-center border-[#11A75C] border-[1px] p-2 bg-[#F6FFED] text-[#11A75C] font-semibold rounded-3xl">
          <Image
            src={MessageSuccessIcon}
            alt="Success Icon"
            width={16}
            height={16}
          />
          <span className="ml-2">{content}</span>
        </div>
      ),
      duration: 3,
      className: "flex justify-end",
    });
  },
};

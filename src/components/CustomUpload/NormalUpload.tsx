import cx from "classnames";
import Image from "next/image";

import PhotographIcon from "@/assets/photograph.svg";

const NormalUpload = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => {
  return (
    <div
      className={cx(
        className,
        "flex h-[100%] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5 mb-3"
      )}
    >
      <Image src={PhotographIcon} alt="" />
      <div className="font-semibold">
        <span className="text-custom-orange">Tải ảnh lên</span>{" "}
        <span className="text-[#6F727A]">hoặc kéo và thả</span>
      </div>
      {title && <div className="font-extralight text-[#6F727A]">{title}</div>}
    </div>
  );
};

export default NormalUpload;

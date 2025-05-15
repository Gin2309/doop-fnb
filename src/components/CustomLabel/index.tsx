import Image from "next/image";

import InfoIcon from "@/assets/info-circle.svg";

const Label = ({
  required,
  infoText,
  label,
  hasInfoIcon = true,
  className = "",
}: {
  required?: boolean;
  infoText?: string;
  label: string;
  hasInfoIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1 font-semibold">
      <span
        className={`font-semibold whitespace-nowrap text-[#15171A] ${className}`}
      >
        {label}
      </span>
      {required && <span className="text-[#FF5C00]">*</span>}
      {/* {hasInfoIcon && <Image src={InfoIcon} alt={infoText} />} */}
    </div>
  );
};

export default Label;

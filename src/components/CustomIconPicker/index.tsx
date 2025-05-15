import { message, UploadFile, UploadProps } from "antd";
import Image from "next/image";
import React, { useState, useEffect, FC } from "react";

interface CustomIconPickerProps {
  className?: string;
  onChangeValue?: (value: string) => void;
  value?: string;
}

const CustomIconPicker: FC<CustomIconPickerProps> = ({
  className,
  onChangeValue,
  value = "",
}) => {
  const [selectedIcon, setSelectedIcon] = useState<string>(value);

  useEffect(() => {
    setSelectedIcon(value);
    onChangeValue?.(value);
  }, [value, onChangeValue]);

  const handleIconChange = (icon: string) => {
    setSelectedIcon(icon);
    onChangeValue?.(icon);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap">
        {Array.from({ length: 25 }, (_, index) => {
          const iconName = `img-${index + 1}`;
          return (
            <div
              key={iconName}
              className={`w-[66px] h-[66px] flex items-center justify-center cursor-pointer rounded-lg ${
                selectedIcon === iconName ? "bg-[#f5b18c]" : ""
              }`}
              onClick={() => handleIconChange(iconName)}
            >
              <Image
                width={60}
                height={60}
                src={`/images/icon/${iconName}.png`}
                alt={`Icon ${index + 1}`}
                className="w-[66px] h-[66px]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomIconPicker;

import { Select } from "antd";
import cx from "classnames";
import Image from "next/image";
import React, { useRef, type ReactNode } from "react";
import SortingIcon from "@/assets/column-sorting.svg";
import { ComponentStyled } from "./styled";

const { Option } = Select;

export function CustomSelect({
  onChange,
  options = [],
  value,
  suffixIcon,
  className,
  wrapClassName,
  style,
  showSearch,
  placeholder,
  prefixIcon,
  dropdownRender,
  onSearch,
  onClick,
  isLoading,
  listHeight = 256,
  addIcon,
  disabled = false,
  mode,
  allowClear,
}: {
  onChange?: (value: any) => void;
  onClick?: (value: any) => void;
  defaultValue?: any;
  value?: any;
  style?: any;
  options?: { value: any; label: any; disabled?: boolean }[];
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: "border-underline" | "suffix-icon" | string;
  wrapClassName?: string;
  showSearch?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  listHeight?: number;
  addIcon?: ReactNode;
  dropdownRender?: any;
  disabled?: boolean;
  mode?: string | any;
  allowClear?: boolean;
}) {
  // const filterOption = (input, option) => {
  //   return option?.label?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
  // };

  const filterOption = (input, option) => {
    const value = option?.value?.toString();
    return value && value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const filterSort = (input, option) => {
    const name = option?.name?.toLowerCase();
    return name && name.indexOf(input.toLowerCase()) >= 0;
  };

  const [open, setOpen] = React.useState(false);

  const handleSuffixClick = () => {
    setOpen(!open);
  };

  return (
    <ComponentStyled
      className={cx(wrapClassName, {
        relative: !!prefixIcon,
      })}
      style={style}
    >
      {prefixIcon && (
        <div className="flex items-center absolute top-[30%] left-[2%] z-[1]">
          {prefixIcon}
        </div>
      )}
      <Select
        open={open} // Thêm thuộc tính open
        onDropdownVisibleChange={setOpen} // Cập nhật trạng thái mở
        showSearch={!!showSearch}
        filterOption={(input: any, option: any) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        onChange={onChange}
        onSearch={onSearch}
        onClick={onClick}
        options={options}
        dropdownRender={dropdownRender}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        listHeight={listHeight}
        mode={mode}
        allowClear={allowClear}
        suffixIcon={
          <div className="flex items-center gap-[5px] cursor-pointer">
            <div onClick={handleSuffixClick}>
              <Image src={SortingIcon} alt="" />
            </div>
            {suffixIcon}
          </div>
        }
        className={cx("normal-select", className, {
          "suffix-icon": !!suffixIcon,
          "prefix-icon": !!prefixIcon,
        })}
        loading={isLoading}
      />
    </ComponentStyled>
  );
}

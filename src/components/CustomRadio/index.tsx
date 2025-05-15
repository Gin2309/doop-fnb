import { Radio, Space } from "antd";

import { RadioStyled } from "./styled";

export function CustomRadio({
  onChange,
  value,
  options,
  className,
  gap,
  direction = "horizontal",
}: {
  onChange?: (value: any) => void;
  value?: any;
  options: { value: any; label: any }[];
  className?: string;
  gap?: number;
  direction?: "vertical" | "horizontal";
}) {
  return (
    <RadioStyled>
      <Radio.Group
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        className={className}
        value={value}
      >
        <Space direction={direction} size={gap || 8}>
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </RadioStyled>
  );
}

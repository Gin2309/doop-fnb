import { Button, Spin } from "antd";
import cx from "classnames";
import type { ReactNode } from "react";

import { ButtonStyled } from "./styled";

export function CustomButton({
  children,
  prefixIcon,
  suffixIcon,
  className,
  type = "danger",
  onClick,
  outline,
  wrapClassName,
  disabled = false,
  onEnter,
  isLoading,
}: {
  children: any;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
  type?:
    | "success"
    | "danger"
    | "primary"
    | "disable"
    | "original"
    | "icon"
    | "link"
    | "outline"
    | "export"
    | "submit"
    | "round-no-border"
    | "border-color"
    | "green-btn"
    | "blue-btn"
    | "search"
    | "download-btn"
    | "vat-btn"
    | "print-btn"
    | "blue-text"
    | "gray"
    | "none";
  onClick?: (value?: any) => void;
  outline?: boolean;
  wrapClassName?: string;
  disabled?: boolean;
  onEnter?: () => void;
  isLoading?: boolean;
}) {
  return (
    <ButtonStyled className={wrapClassName}>
      <Button
        onClick={onClick}
        type="primary"
        className={cx(
          className,
          type,
          outline ? "btn-outline" : "",
          "flex items-center"
        )}
        disabled={disabled}
        onKeyUp={(e) => {
          if (e.keyCode === 13 && onEnter) {
            onEnter();
          }
        }}
      >
        {prefixIcon ? <div className="mr-2 mt-[5px]">{prefixIcon}</div> : <></>}
        {isLoading ? <Spin /> : children}
        {suffixIcon ? <div className="ml-2 mt-[5px]">{suffixIcon}</div> : <></>}
      </Button>
    </ButtonStyled>
  );
}

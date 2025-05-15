import React from "react";
import { ButtonStyled } from "./styled";
import type { ReactNode } from "react";
import { Button } from "antd";
import cx from "classnames";

const QuantityButton = ({
  onClick,
  prefixIcon,
  type = "quantity",
}: {
  prefixIcon?: ReactNode;
  onClick?: (value?: any) => void;
  type?: "quantity";
}) => {
  return (
    <>
      <ButtonStyled>
        <Button onClick={onClick} className={cx(type)}>
          {prefixIcon ? <div className="btn">{prefixIcon}</div> : <></>}
        </Button>
      </ButtonStyled>
    </>
  );
};

export default QuantityButton;

import { Button } from "antd";
import cx from "classnames";
import type { ReactNode } from "react";

import { CardStyled } from "./styled";

export function CustomCardContent({
  children,
  className,
}: {
  children: any;
  className?: string;
}) {
  return <CardStyled className={className}>{children}</CardStyled>;
}

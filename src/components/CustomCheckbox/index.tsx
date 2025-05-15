import type { CheckboxProps } from "antd/es/checkbox/Checkbox";

import { CheckboxStyled } from "./styled";

export function CustomCheckbox(props: CheckboxProps) {
  return <CheckboxStyled className="accent-[#FF5C00]" {...props} />;
}

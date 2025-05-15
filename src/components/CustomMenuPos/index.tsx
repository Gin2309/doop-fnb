import { MenuProps } from "antd";
import { MenuStyled } from "./styled";

export function CustomMenu(props: MenuProps) {
  return <MenuStyled {...props} />;
}

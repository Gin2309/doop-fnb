import type { TableProps } from "antd";
import { CustomTableStyled } from "./styled";

const CustomTableTimeSheet = (props: TableProps<any>) => {
  return (
    <CustomTableStyled
      {...props}
      pagination={false}
      scroll={props.scroll ? props.scroll : { x: 3000 }}
    />
  );
};

export default CustomTableTimeSheet;

import type { TableProps } from "antd";
import { CustomTableStyled } from "./styled";

const CustomTable = (props: TableProps<any>) => {
  return (
    <CustomTableStyled
      {...props}
      pagination={false}
      scroll={props.scroll ? props.scroll : { x: 1000 }}
    />
  );
};

export default CustomTable;

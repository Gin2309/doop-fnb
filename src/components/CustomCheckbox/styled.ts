import { Checkbox } from "antd";
import styled from "styled-components";

export const CheckboxStyled = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ff5c00 !important;
    border-color: #ff5c00 !important;
  }

  .ant-checkbox-wrapper {
    margin-top: 5px !important;
  }
`;

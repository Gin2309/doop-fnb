import { Switch } from "antd";
import styled from "styled-components";

export const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: rgba(255, 92, 0, 1);
  }
  &.ant-switch:hover {
    background-color: rgba(255, 92, 0, 1) !important;
  }
  &.ant-switch:not(.ant-switch-checked) {
    background-color: #ccc;
  }
`;

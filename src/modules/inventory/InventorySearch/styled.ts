import styled from "styled-components";
import { Input } from "antd";

export const ComponentStyled = styled.div`
  .ant-input {
    margin-left: 5px;
  }

  .ant-input:placeholder {
    color: #666666 !important;
  }
`;

export const SearchInput = styled(Input)`
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 1px solid #e5e5e5;
  border-color: #e5e5e5;
  margin-bottom: 30px;
`;

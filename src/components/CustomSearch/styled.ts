import styled from "styled-components";
import { Input } from "antd";

export const ComponentStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  .ant-input {
    margin-left: 5px;
  }

  .ant-input:placeholder {
    color: #666666 !important;
  }

  .ant-dropdown-menu-title-content {
    color: #666666; !important
    font-size: 16px
  }
`;

export const FilterInput = styled(Input)`
  grid-column: span 3;
  padding: 8px 12px;
  border-radius: 8px 0 0 8px;
  border-right: 0;
  border-color: #e5e5e5;
`;

export const SearchInput = styled(Input)`
  grid-column: span 4;
  padding: 8px 12px;
  border-radius: 0 8px 8px 0;
  border-left: 1px solid #e5e5e5;
  border-color: #e5e5e5;
`;

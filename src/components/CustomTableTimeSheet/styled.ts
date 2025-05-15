import styled from "styled-components";
import { Table } from "antd";

export const CustomTableStyled = styled(Table)`
  .ant-table-container {
    border: 1px solid #d6ddff;
    border-radius: 0;
  }
  .ant-table-container table > thead > tr:first-child > *:first-child {
    border-start-start-radius: 0px;
  }

  .ant-table-container table > thead > tr:first-child > *:last-child {
    border-start-end-radius: 0px;
  }

  thead.ant-table-thead .ant-table-cell {
    text-align: center;
    border-right: 1px solid #d6ddff;
    background: #f9fafd;
  }

  tbody.ant-table-tbody > .ant-table-row > .ant-table-cell {
    text-align: center;
    border-right: 1px solid #d6ddff;
    border-top: 1px solid #d6ddff;
  }

  tbody.ant-table-tbody > .ant-table-row > .ant-table-cell-row-hover {
    background-color: transparent;
  }

  .ant-table-expanded-row > .ant-table-cell {
    padding: 0 0;
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ff5c00;
    border-color: #ff5c00;
  }

  .ant-checkbox-input {
    &:hover {
      border-color: #ff5c00 !important;
      background-color: #ff5c00 !important;
    }
  }

  .ant-table-row-selected > .ant-table-cell {
    background: #fff2e4 !important;
  }

  .hover-row {
    cursor: pointer;
  }
`;

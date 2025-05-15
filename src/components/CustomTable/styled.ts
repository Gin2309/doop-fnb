import styled from "styled-components";
import { Table } from "antd";

export const CustomTableStyled = styled(Table)`
  .ant-table-container table > thead > tr:first-child > *:first-child {
    border-start-start-radius: 0px;
  }

  .ant-table-container table > thead > tr:first-child > *:last-child {
    border-start-end-radius: 0px;
  }

  thead.ant-table-thead .ant-table-cell {
    border-bottom: 1px solid #e9edf5;
    background: #f9fafd;
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

  .parent-row {
    background-color: #fef2eb;
  }

  .parent-row td {
    font-weight: 600;
  }
`;

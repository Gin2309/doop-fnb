import { Menu } from "antd";
import styled from "styled-components";

export const MenuStyled = styled(Menu as any)`
  .ant-menu-overflow-item {
    padding: 20px 28px;
    display: flex;
    align-items: center;
  }

  .ant-menu-title-content {
    font-weight: 600;
    margin-left: 10px;
    font-size: 17px;
  }

  .ant-menu-overflow-item.ant-menu-item.ant-menu-item-selected::after {
    border-bottom-color: transparent;
  }

  .ant-menu-overflow-item.ant-menu-item:hover::after {
    border-bottom-color: transparent;
  }

  .ant-menu-overflow-item.ant-menu-item.ant-menu-item-selected {
    border-bottom: 4px solid #ff5c00;
    background-color: #fff2e4;
  }

  .ant-menu-item-selected > .ant-menu-title-content {
    color: #ff5c00;
  }
`;

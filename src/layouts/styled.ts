import styled from "styled-components";

export const SideBarStyled = styled.div`
  border-right: 1px solid #ffe6cc;
  height: 100vh;
  min-height: 100vh;
  overflow-y: auto;
  background-color: white;
  position: relative;
  overflow: hidden;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
    visibility: hidden;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background-color: #f5f5f5;
    visibility: hidden;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    visibility: hidden;
  }

  .ant-menu {
    background: white !important;
  }

  .ant-menu > .ant-menu-item {
    padding: 16px !important;
    height: unset !important;
    line-height: 1 !important;
  }

  .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title {
    padding: 16px !important;
    height: unset !important;
    line-height: 2 !important;
    border-radius: 3px;

    .ant-menu-item-icon {
      color: #333333;
    }

    .ant-menu-title-content {
      margin-left: 10px;
      color: #333333;
    }

    .ant-menu-submenu-arrow {
      color: #333333;
    }
  }

  .ant-menu-submenu > .ant-menu-sub > .ant-menu-item {
    padding: 8px 18px !important;
    border-radius: 3px;
  }

  .ant-menu-item > .ant-menu-title-content {
    margin-left: 10px;
    overflow: unset;
    white-space: normal;
    line-height: 24px;
    color: #333333;
  }

  [data-menu-id*="/auth/sign-in"] > .ant-menu-title-content {
    color: #e50000;
  }

  [data-menu-id*="branch"] > .ant-menu-title-content {
    font-weight: 600;
  }

  [data-menu-id*="branch-child"] > .ant-menu-title-content {
    font-weight: 400;
  }

  .ant-menu-item-disabled > .ant-menu-title-content {
    color: #ff5c00 !important;
    font-weight: 600;
    margin-left: 10px;
  }

  .ant-menu-item-disabled > span > .ant-menu-item-icon {
    cursor: pointer !important;
  }

  .ant-menu-root > .ant-menu-item-selected {
    border-right: 6px solid #ff5c00;
    margin-right: 0px;
    width: 99%;
    background: #fff2e4 !important;
    color: #ff5c00 !important;
    font-weight: 600;
    border-radius: 3px;
    span {
      color: #ff5c00 !important;
    }

    .ant-menu-title-content {
      color: #ff5c00 !important;
    }
    .ant-menu-submenu-arrow {
      color: #ff5c00 !important;
    }
  }

  .ant-menu-submenu > .ant-menu-sub > .ant-menu-item-selected {
    background: #fff2e4 !important;
    border-right: 4px solid #ff5c00;

    .ant-menu-title-content {
      color: #ff5c00 !important;
    }
  }

  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #ff5c00 !important;
    font-weight: 600;
  }

  .ant-menu-submenu-selected
    > .ant-menu-submenu-title
    > .ant-menu-title-content,
  .ant-menu-submenu-selected > .ant-menu-submenu-title > .ant-menu-item-icon {
    color: #ff5c00 !important;
  }
`;

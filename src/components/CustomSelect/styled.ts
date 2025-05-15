import styled from "styled-components";

export const ComponentStyled = styled.div`
  width: 100%;

  .normal-select {
    height: 44px;
    width: 100% !important;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: white;
    .ant-select-selector {
      border: unset !important;
      box-shadow: unset !important;
      background-color: transparent;
      padding: 12px 16px;
    }
  }

  .ant-select .ant-select-selector {
    border-radius: unset !important;
  }

  .border-underline {
    border-bottom: 1px solid #e4e4e4;
    border-top: unset;
    border-left: unset;
    border-right: unset;
    border-radius: unset;

    .ant-select-selector {
      border: unset;
      box-shadow: none !important;
    }
  }

  .suffix-icon {
    .ant-select-selector {
      width: calc(100% - 35px);
    }
  }

  .prefix-icon {
    .ant-select-selector {
      padding-left: 44px;

      input {
        padding-left: 34px !important;
      }
    }
  }

  .ant-select-arrow {
    pointer-events: unset;
  }

  .ant-select-selection-item {
    border-radius: 50px;
    padding: 0 12px;
  }

  .multiple {
    min-height: 100% !important;
    height: auto;
    display: block;
  }

  .multiple .ant-select-selector {
    padding: 0px 12px !important;
    border-radius: unset;

    display: flex;
    flex-wrap: wrap;
    min-height: 42px;
    overflow-y: auto;
  }

  .multiple.ant-select-disabled .ant-select-selection-item {
    color: #1a1a1a;
    background: #fff;
    border: 1px solid #d7dfe9;
  }

  .ant-select-disabled .ant-select-selection-item {
    color: #1a1a1a;
  }
`;

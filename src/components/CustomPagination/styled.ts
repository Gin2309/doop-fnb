import styled from "styled-components";

export const PaginationStyled = styled.div`
  .ant-pagination-options {
    display: none;
  }

  .ant-pagination-item {
    background-color: transparent;
    border-radius: 8px;
    min-width: 32px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-weight: 600;
    border: 1px solid #ccc;
    a {
      font-size: 12px;
      padding: 0 5px;
      border-bottom-width: 2px;
      --tw-border-opacity: 1;
      border-color: transparent;
    }
  }

  .ant-pagination-item:not(.ant-pagination-item-active):hover {
    background-color: rgba(255, 92, 0, 1);
    opacity: 0.8;

    a {
      color: #fff;
    }
  }

  .ant-pagination-item-active {
    background-color: rgba(255, 92, 0, 1);
    border: unset;

    &:hover {
      opacity: 0.8;
    }

    a {
      color: #fff;
      margin-top: 1px;

      &:hover {
        color: #fff;
      }
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8;
    min-width: 32px;
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
  }

  .ant-pagination-item-ellipsis {
    border-radius: 50%;
    color: #555770 !important;
    font-size: 10px;
    width: 24px;
    height: 24px;
  }

  .anticon-double-right {
    svg {
      color: #d64457;
    }
  }
`;

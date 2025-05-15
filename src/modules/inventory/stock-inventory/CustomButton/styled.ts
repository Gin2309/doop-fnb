import styled from "styled-components";

export const ButtonStyled = styled.div`
  .ant-btn {
    width: 24px !important;
    height: 24px !important;
    padding: 0;
    border-radius: 6px !important;
  }

  .quantity {
    background: #f9fafb;
    border: 1px solid #d7dfe9;
    span {
      font-size: inherit;
      color: #f9fafb;
      background: #f9fafb;
    }

    &:hover {
      background: #f9fafb !important;
      border: 1px solid #d7dfe9 !important;
      opacity: 0.8;
    }
  }

  .ant-btn .btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

import styled from "styled-components";

export const StyledComponent = styled.div`
  height: 100%;

  .empty-btn {
    background: #7d808f;
  }

  .empty {
    border: 1px solid #e5e5e5;
    background: #fff;
  }

  .empty-span-2 {
    color: #1a1a1a;
    font-weight: 400;
  }

  .occupied-btn {
    background: #ff5c00;
  }

  .occupied {
    border: 1px solid #ff5c00;
    background: #fee8d9;
  }

  .occupied-span-2 {
    color: #ff5c00;
    font-weight: 600;
  }

  .reserved-btn {
    background: #148c4b;
  }

  .reserved {
    border: 1px solid #148c4b;
    background: #d9f6ea;
  }

  .reserved-span-2 {
    color: #148c4b;
    font-weight: 600;
  }
`;

export const StyledPopoverContent = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-weight: 600;
    font-size: 20px;
  }

  .empty-name {
    color: #1a1a1a;
    font-weight: 400;
  }

  .empty-dot {
    background: #1a1a1a;
  }

  .empty-block {
    background: #ccc;
    color: #fff;
  }

  .occupied-name {
    color: #ff5c00;
    font-weight: 600;
  }

  .occupied-block {
    background: #fee8d9;
    color: #ff5c00;
  }

  .occupied-dot {
    background: #ff5c00;
  }

  .reserved-name {
    color: #148c4b;
    font-weight: 600;
  }

  .reserved-dot {
    background: #148c4b;
  }

  .reserved-block {
    background: #d9f6ea;
    color: #148c4b;
  }
`;

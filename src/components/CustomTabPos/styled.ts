import styled, { css } from "styled-components";

export const TabContainer = styled.div``;

export const TabItem = styled.div<{ isactive: boolean; isfirst?: boolean }>`
  flex-direction: column;
  position: relative;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  ${({ isactive }) =>
    isactive &&
    css`
      background-color: #f38820;
      color: #ffffff;
    `}
  border: 0px solid #ff5c00;
  border-radius: 8px;
  overflow: hidden;
`;

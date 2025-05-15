import styled, { css } from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const TabHeader = styled.div`
  display: flex;
  gap: 3px;
  background: transparent;
`;

export const TabItem = styled.div<{ isactive: boolean; isfirst?: boolean }>`
  position: relative;
  font-weight: 600;
  width: 160px;
  height: 40px;
  cursor: pointer;
  color: ${({ isactive }) => (isactive ? "#FF5C00" : "#333333")};
  background-color: ${({ isactive }) => (isactive ? "#fff4f0" : "#fff4f0")};
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: ${({ isfirst }) =>
    isfirst
      ? "polygon(0 0, 90% 0, 100% 100%, 0 100%, 0 40%)"
      : "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"};
  ${({ isactive }) =>
    isactive &&
    css`
      background-color: #fff;
      color: #ff5c00;
    `}
  margin-left: ${({ isfirst }) => (isfirst ? "0" : "-15px")};
  z-index: ${({ isactive }) => (isactive ? 2 : 1)};
  border: 0px solid #ff5c00;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

export const TabContent = styled.div`
  padding: 24px;
  background-color: #fff;
  border-radius: 0 8px 8px 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

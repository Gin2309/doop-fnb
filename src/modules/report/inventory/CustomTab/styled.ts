import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const TabHeader = styled.div`
  display: flex;
  gap: 16px;
`;

export const TabItem = styled.div<{ isactive: boolean; isfirst?: boolean }>`
  position: relative;
  font-weight: 600;
  height: 40px;
  cursor: pointer;
  color: ${({ isactive }) => (isactive ? "#FF5C00" : "#333333")};
  border-bottom: ${({ isactive }) =>
    isactive ? "2px solid #FF5C00" : "#fff4f0"};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const TabContent = styled.div`
  background-color: #fff;
`;

import styled from "styled-components";

export const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export const TabHeader = styled.div`
  display: flex;
  gap: 16px;
  background-color: #fff4f0;
`;

export const TabItem = styled.div<{ isactive: boolean; isfirst?: boolean }>`
  position: relative;
  font-weight: 500;
  height: 40px;
  cursor: pointer;
  color: ${({ isactive }) => (isactive ? "#FF5C00" : "#333333")};
  border-bottom: ${({ isactive }) =>
    isactive ? "2px solid #FF5C00" : "#fff4f0"};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 50%;
`;

export const TabContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
  padding: 15px;
`;

import React, { useState } from "react";
import { TabsProps } from "antd";
import Image from "next/image";
import { isIconAvatar } from "@/utils";
import styled, { css } from "styled-components";


interface TabItemProps {
  key: string;
  label: string;
  children: React.ReactNode;
}

interface Props {
  menu: TabsProps["items"];
  defaultIndex?: number;
  onChange?: (key: string) => void;
  setSelectIdMenu?: any;
}

const CustomTabPos: React.FC<Props> = ({
  menu,
  defaultIndex = 0,
  onChange,
  setSelectIdMenu,
}: Props) => {
  const [select, setSelect] = useState(defaultIndex);

  const handleTabChange = (index: number, key: string) => {
    setSelect(index);
    if (setSelectIdMenu) {
      setSelectIdMenu(key);
    }
  };

  return (
    <TabContainer>
      {menu?.map((item: any, index) => (
        <TabItem
          key={item.key}
          isactive={index === select}
          isfirst={index === 0}
          onClick={() => handleTabChange(index, item.key)}
          aria-selected={index === select}
          aria-controls={`tab-content-${item.key}`}
          className="text-center"
        >
          {isIconAvatar(item.avatar) ? (
            <Image
              width={60}
              height={60}
              src={`/images/icon/${item.avatar}.png`}
              alt={`Icon ${index + 1}`}
              className="w-[66px] h-[66px]"
            />
          ) : (
            <Image
              width={60}
              height={60}
              alt="cafe"
              src={item.avatar || "/images/services1.png"}
            />
          )}
          <p className="mt-3 whitespace-normal">{item?.label}</p>
          <p className="mt-2 text-sm font-light whitespace-normal">
            {item?.children}
          </p>
        </TabItem>
      ))}
    </TabContainer>
  );
};


export const TabContainer = styled.div`
  max-height: 100vh; 
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

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


export default CustomTabPos;

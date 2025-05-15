import React, { useState } from "react";
import { TabContainer, TabItem } from "./styled";
import { TabsProps } from "antd";

interface TabItemProps {
  key: string;
  label: string;
  children: React.ReactNode;
}

interface Props {
  menu: TabsProps["items"];
  defaultIndex?: number;
  onChange?: (key: string) => void;
  setSelectArea?: any;
  data?: any;
  setAreaId?: any;
}

const CustomTabPos: React.FC<Props> = ({
  menu,
  defaultIndex = 0,
  onChange,
  setSelectArea,
  data,
  setAreaId,
}: Props) => {
  const [select, setSelect] = useState(defaultIndex);

  const handleTabChange = (index: number, item: any) => {
    setSelect(index);
    if (onChange) onChange(item.key)
    if (setSelectArea) {
      setSelectArea(item);
    }

    if (setAreaId) {
      setAreaId(item.id);
    }
  };

  return (
    <TabContainer>
      {menu?.map((item: any, index) => (
        <TabItem
          key={item.key}
          isactive={index === select}
          isfirst={index === 0}
          onClick={() => handleTabChange(index, item)}
          aria-selected={index === select}
          aria-controls={`tab-content-${item.key}`}
          className="text-center"
        >
          {item.icon}
          <p className="mt-3 whitespace-normal">{item?.name}</p>
          <p className="mt-2 text-sm font-light whitespace-normal">
            {item?.children}
          </p>
        </TabItem>
      ))}
    </TabContainer>
  );
};

export default CustomTabPos;

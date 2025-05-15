import React, { useState } from "react";
import { TabContainer, TabHeader, TabItem, TabContent } from "./styled";

interface Props {
  menu: Array<string>;
  defaultIndex?: number;
  onTabChange?: (index: number) => void;
}

const CustomTabSelect = ({ menu, defaultIndex, onTabChange }: Props) => {
  const [select, setSelect] = useState(defaultIndex ?? 0);

  const handleTabChange = (index: number) => {
    setSelect(index);
    onTabChange?.(index);
  };

  return (
    <TabContainer>
      <TabHeader>
        {menu.map((item, index) => (
          <TabItem
            key={index}
            isactive={index === select}
            onClick={() => handleTabChange(index)}
          >
            {item}
          </TabItem>
        ))}
      </TabHeader>
    </TabContainer>
  );
};

export default CustomTabSelect;

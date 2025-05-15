import React, { useState } from "react";
import { TabContainer, TabHeader, TabItem, TabContent } from "./styled";

interface Props {
  menu: Array<string>;
  defaultIndex?: number;
  components: Array<React.ReactNode>;
}

const Tab = ({ menu, components, defaultIndex }: Props) => {
  const [select, setSelect] = useState(defaultIndex ?? 0);

  return (
    <TabContainer>
      <TabHeader>
        {menu.map((item, index) => (
          <TabItem
            key={index}
            isactive={index === select}
            isfirst={index === 0}
            onClick={() => setSelect(index)}
          >
            {item}
          </TabItem>
        ))}
      </TabHeader>
      <TabContent>{components[select]}</TabContent>
    </TabContainer>
  );
};

export default Tab;

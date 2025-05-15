import React, { useState } from "react";
import { TabContainer, TabHeader, TabItem, TabContent } from "./styled";

interface Props {
  menu: Array<string>;
  components: Array<React.ReactNode>;
  selectTab: any;
  setSelectTab: any;
}

const Tab = ({ menu, components, selectTab, setSelectTab }: Props) => {
  return (
    <TabContainer>
      <TabHeader>
        {menu.map((item, index) => (
          <TabItem
            key={index}
            isactive={index === selectTab}
            isfirst={index === 0}
            onClick={() => setSelectTab(index)}
          >
            {item}
          </TabItem>
        ))}
      </TabHeader>
      <TabContent>{components[selectTab]}</TabContent>
    </TabContainer>
  );
};

export default Tab;

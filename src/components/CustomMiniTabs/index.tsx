import React, { useState } from "react";

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}

const CustomTabs: React.FC<TabsProps> = ({ tabs, activeKey, onChange }) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex overflow-x-auto scrollbar-hidden border-b-[1px] border-[#ccc] w-full">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`font-medium transition-all duration-200 w-[250px] pb-2
            ${
              activeKey === tab.key
                ? "text-[#FF5C00] border-b-[2px] border-[#FF5C00]"
                : "text-[#333333]"
            }      
          `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div></div>
    </div>
  );
};
export default CustomTabs;

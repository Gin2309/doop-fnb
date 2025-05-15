import React, { useState } from "react";

type TabItem = {
    titleTab: string;
    UITabs: React.ReactNode;
};

type TabsProps = {
    tabs: TabItem[];
};


const TabsComponent: React.FC<TabsProps> = ({ tabs }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Tabs Header */}
            <div className="flex">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center pr-6 cursor-pointer ${activeIndex === index ? "text-orange-500 font-semibold" : "text-gray-800"
                            }`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <span className="text-[16px] font-semibold">{tab.titleTab}</span>
                        <div
                            className={`h-[3px] w-full mt-1 ${activeIndex === index ? "bg-orange-500" : "bg-transparent"
                                }`}
                        />
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {tabs[activeIndex]?.UITabs}
            </div>
        </div>
    );
};

export default TabsComponent;

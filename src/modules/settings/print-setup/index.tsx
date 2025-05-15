import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import CustomTabs from "@/components/CustomMiniTabs";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomSwitch } from "@/components/CustomSwitch";
import { Divider } from "antd";
import { useState } from "react";
import BillPrint from "./bill";
import TemPrint from "./tem";
import InventoryPrint from "./inventory";
import BarPrint from "./bar";

const tabs = [
  { key: "bill", label: "Mẫu in hóa đơn" },
  { key: "tem", label: "Mẫu in tem" },
  { key: "bar", label: "Mẫu in bếp" },
  { key: "inventory", label: "Mẫu in phiếu kiểm đồ" },
];

export function PrintSetup() {
  const [activeTab, setActiveTab] = useState("bill");
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">Thiết lập in</p>
      </div>
      <div className="bg-white mt-5 pt-5 mx-5 rounded-lg">
        <CustomTabs
          tabs={tabs}
          onChange={handleTabChange}
          activeKey={activeTab}
        />
      </div>

      {activeTab === "bill" && <BillPrint />}
      {activeTab === "tem" && <TemPrint />}
      {activeTab === "bar" && <BarPrint />}
      {activeTab === "inventory" && <InventoryPrint />}
    </>
  );
}

export default PrintSetup;

import CustomTabPos from "@/components/CustomTabPos";
import { Meta } from "@/layouts/Meta";
import PostLayout from "@/layouts/PosLayout";
import { TabsProps } from "antd";
import { useState } from "react";
import { FloorPosIcon } from "@/shared/icons/FloorPosIcon";
import { BilliardsPosIcon } from "@/shared/icons/BilliardsPosIcon";
import { EntertainmentPosIcon } from "@/shared/icons/EntertainmentPosIcon";
import { HotelPosIcon } from "@/shared/icons/HotelPosIcon";
import DiagramPos from "@/modules/pos/diagram/DiagramPos";
import { WalkIcon } from "@/shared/icons/WalkIcon";
import { CalendarCircle } from "@/shared/icons/CalendarCircle";
import { CalendarAdd } from "@/shared/icons/CalendarAdd";
import TablePos from "@/modules/pos/table/TablePos";
import FormPosTable from "@/modules/pos/table/form/FormPosTable";

export default function FormPosTablePage() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Khách sắp đến",
      icon: <WalkIcon />,
    },
    {
      key: "2",
      label: "Chưa xếp bàn",
      icon: <CalendarCircle />,
    },
    {
      key: "3",
      label: "Thêm đặt bàn",
      icon: <CalendarAdd />,
    },
  ];

  return (
    <PostLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <div className="flex">
        <div className="w-[124px] h-screen border-r border-[#FFE6CC] p-4">
          <CustomTabPos menu={items} />
        </div>
        <div className="flex-1 bg-[#F8F9FD]">
          <FormPosTable />
        </div>
      </div>
    </PostLayout>
  );
}

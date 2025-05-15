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

const fakeData = [
  {
    key: 1,
    customerName: "Nguyễn Văn A",
    reservationTime: "2024-08-28 18:00",
    phoneNumber: "0901234567",
    numberOfPeople: 4,
    tablePosition: "Bàn 1",
    dish: 6,
  },
  {
    key: 2,
    customerName: "Trần Thị B",
    reservationTime: "2024-08-28 19:00",
    phoneNumber: "0987654321",
    numberOfPeople: 2,
    tablePosition: "Bàn 2",
    dish: 6,
  },
  {
    key: 3,
    customerName: "Phạm Minh C",
    reservationTime: "2024-08-28 20:00",
    phoneNumber: "0912345678",
    numberOfPeople: 3,
    tablePosition: "Bàn 3",
    dish: 6,
  },
  {
    key: 4,
    customerName: "Lê Thị D",
    reservationTime: "2024-08-28 18:30",
    phoneNumber: "0938765432",
    numberOfPeople: 5,
    tablePosition: "Bàn 4",
    dish: 6,
  },
  {
    key: 5,
    customerName: "Võ Văn E",
    reservationTime: "2024-08-28 19:30",
    phoneNumber: "0923456789",
    numberOfPeople: 6,
    tablePosition: "Bàn 5",
    dish: 6,
  },
  {
    key: 6,
    customerName: "Ngô Thị F",
    reservationTime: "2024-08-28 20:30",
    phoneNumber: "0919876543",
    numberOfPeople: 2,
    tablePosition: "Bàn 6",
    dish: 6,
  },
  {
    key: 7,
    customerName: "Hoàng Văn G",
    reservationTime: "2024-08-28 21:00",
    phoneNumber: "0908765432",
    numberOfPeople: 4,
    tablePosition: "Bàn 7",
    dish: 6,
  },
  {
    key: 8,
    customerName: "Đinh Thị H",
    reservationTime: "2024-08-28 21:30",
    phoneNumber: "0981234567",
    numberOfPeople: 3,
    tablePosition: "Bàn 8",
    dish: 6,
  },
  {
    key: 9,
    customerName: "Đoàn Văn I",
    reservationTime: "2024-08-28 18:00",
    phoneNumber: "0901122334",
    numberOfPeople: 2,
    tablePosition: "Bàn 9",
    dish: 6,
  },
  {
    key: 10,
    customerName: "Lý Thị J",
    reservationTime: "2024-08-28 19:00",
    phoneNumber: "0934567890",
    numberOfPeople: 4,
    tablePosition: "Bàn 10",
    dish: 6,
  },
];

export default function TablePosPage() {
  const [data, setData] = useState<any[]>(fakeData);
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
          <TablePos data={data} />
        </div>
      </div>
    </PostLayout>
  );
}

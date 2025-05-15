import { useEffect, useState } from "react";
import { Meta } from "@/layouts/Meta";

import CustomTabPos from "@/components/CustomTabPos";
import PostLayout from "@/layouts/PosLayout";
import { TabsProps } from "antd";

import { AllPosIcon } from "@/shared/icons/AllPosIcon";
import { MotorbikePosIcon } from "@/shared/icons/MotorbikePosIcon";
import { BagPosIcon } from "@/shared/icons/BagPosIcon";
import { DishPosIcon } from "@/shared/icons/DishPosIcon";
import InvoicePos from "@/modules/pos/invoice/InvoicePos";

import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getBill, getCurrentBill } from "@/api/bill-pos.service";
import { branchStateSession } from "@/recoil/state";

const fakeData = [
  {
    key: "1",
    time: "2024-11-18T14:30:00Z",
    referenceCode: "REF123456",
    cashier: { name: "Nguyễn Văn A" },
    type: "Dine-in",
    orderArea: "Khu vực A",
    paymentStatus: "PAID",
    totalAmount: 350000,
    status: "ACTIVE",
  },
  {
    key: "2",
    time: "2024-11-18T16:00:00Z",
    referenceCode: "REF123457",
    cashier: { name: "Trần Thị B" },
    type: "Takeaway",
    orderArea: "Khu vực B",
    paymentStatus: "PENDING",
    totalAmount: 150000,
    status: "INACTIVE",
  },
  {
    key: "3",
    time: "2024-11-17T10:15:00Z",
    referenceCode: "REF123458",
    cashier: { name: "Lê Văn C" },
    type: "Delivery",
    orderArea: "Khu vực C",
    paymentStatus: "UNPAID",
    totalAmount: 500000,
    status: "RESIGNED",
  },
  {
    key: "4",
    time: "2024-11-18T12:00:00Z",
    referenceCode: "REF123459",
    cashier: { name: "Phạm Thị D" },
    type: "Dine-in",
    orderArea: "Khu vực D",
    paymentStatus: "PAID",
    totalAmount: 700000,
    status: "ACTIVE",
  },
];

const filterData = (key: string): any[] => {
  if (key === "1") return fakeData;
  if (key === "2") return fakeData.filter((item) => item.type === "DINE_IN");
  if (key === "3") return fakeData.filter((item) => item.type === "TAKE_AWAY");
  if (key === "4") return fakeData.filter((item) => item.type === "DELIVERY");
  return [];
};

export default function InvoicePosPage() {
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    sort: "createdAt",
    keyword: "",
    branchId: branchId,
    status: "",
  });

  const {
    data: current,
    isLoading: isCurrentLoading,
    refetch: refectCurrent,
  } = useQuery(["CURRENT_BILL", formFilter], () => getCurrentBill(formFilter));

  const {
    data: paid,
    isLoading: isPaidLoading,
    refetch: refectPaid,
  } = useQuery(["PAID_BILL", formFilter], () => getBill(formFilter));

  const [data, setData] = useState(current);
  const [dataKey, setDataKey] = useState("current");

  useEffect(() => {
    if (dataKey === "current") {
      setData(current);
      refectCurrent();
    } else if (dataKey === "paid") {
      setData(paid);
      refectPaid();
    } else {
      setData(current);
    }
  }, [dataKey, current, paid]);

  const billData = data?.data?.content;

  const [fakedata, setFakeData] = useState<any[]>(fakeData);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tất cả đơn",
      icon: <AllPosIcon />,
      children: `${data?.data?.totalElements} đơn`,
    },
    {
      key: "2",
      label: "Ăn tại bàn",
      icon: <DishPosIcon />,
      children: `${
        billData?.filter((item) => item.type === "DINE_IN").length
      } đơn`,
    },
    {
      key: "3",
      label: "Mang đi",
      icon: <BagPosIcon />,
      children: `${
        billData?.filter((item) => item.type === "TAKE_AWAY").length
      } đơn`,
    },
    {
      key: "4",
      label: "Giao hàng",
      icon: <MotorbikePosIcon />,
      children: `${
        billData?.filter((item) => item.type === "DELIVERY").length
      }  đơn`,
    },
  ];

  const handleChange = (key: string) => {
    console.log(filterData(key));

    setFakeData(filterData(key));
  };

  return (
    <PostLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <div className="flex">
        <div className="w-[124px] h-screen border-r border-[#FFE6CC] p-4">
          <CustomTabPos menu={items} onChange={handleChange} />
        </div>
        <div className="flex-1 bg-[#F8F9FD]">
          <InvoicePos
            data={data?.data}
            formFilter={formFilter}
            setFormFilter={setFormFilter}
            isLoading={isCurrentLoading}
            isLoading2={isPaidLoading}
            setData={setDataKey}
            keyData={dataKey}
          />
        </div>
      </div>
    </PostLayout>
  );
}

import { getBar } from "@/api/kitchen.service";
import Bar1Icon from "@/assets/Bar1.svg";
import PendingPaymentIcon from "@/assets/pending-payment.svg";
import BringServeIcon from "@/assets/serve.svg";
import CustomTabPos from "@/components/CustomTabPos";
import Title from "@/components/Title";
import { Meta } from "@/layouts/Meta";
import PostLayout from "@/layouts/PosLayout";
import ServicePos from "@/modules/pos/service";
import { branchStateSession } from "@/recoil/state";
import { useQuery } from "@tanstack/react-query";
import { TabsProps } from "antd";
import Image from "next/image";
import { Tab } from "rc-tabs/lib/interface";
import { CSSProperties, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

export default function TablePosPage() {
  const [branch] = useRecoilState(branchStateSession);
  const { data: dataResBars } = useQuery(["BAR", { branchId: branch?.id, keyword: "" }], () => {
    return getBar({ branchId: branch?.id, keyword: "" });
  });
  const bars = dataResBars?.data || [];

  const [activeKeyIndex, setActiveKeyIndex] = useState(0);
  const [activeKey, setActiveKey] = useState("waiting");

  const items = useMemo(() => {
    const activeStyle: CSSProperties = { filter: "brightness(0) invert(1)" };
    const _items: TabsProps["items"] = [
      {
        key: "waiting",
        label: <></>,
        icon: <Image src={PendingPaymentIcon} alt="" style={activeKey === "waiting" ? activeStyle : {}} />,
        children: <>Chờ thanh toán</>
      },
      ...bars.map<Tab>((bar) => {
        return {
          key: `bar-${bar.id}`,
          label: <></>,
          icon: <Image src={Bar1Icon} alt={bar.name} style={activeKey === `bar-${bar.id}` ? activeStyle : {}} />,
          children: <>Chế biến
            <br />
            {bar.name}
          </>
        }
      }),
      {
        key: "serve",
        label: <></>,
        icon: <Image src={BringServeIcon} alt="bring-serve" style={activeKey === "serve" ? activeStyle : {}} />,
        children: <>Mang <br /> phục vụ</>
      }
    ];
    return _items;
  }, [bars, activeKey]);

  const {
    serviceTitle,
    currentBar
  } = useMemo(() => {
    let title = "";
    const currentBar = bars.find((bar) => `bar-${bar.id}` === activeKey);
    if (activeKey === "waiting") {
      title = "chờ thanh toán";
    } else if (activeKey.startsWith("bar")) {
      title = "chờ chế biến" + ` ${currentBar?.name ?? ""}`;
    } else if (activeKey === "serve") {
      title = "mang phục vụ";
    }
    return {
      serviceTitle: `Danh sách dịch  vụ ${title}`,
      currentBar
    }
  }, [activeKey]);



  return (
    <PostLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <div className="flex">
        <div className="w-[124px] h-screen border-r border-[#FFE6CC] py-4 px-2">
          <CustomTabPos menu={items}
            defaultIndex={activeKeyIndex}
            onChange={(key) => {
              setActiveKey(key);
              const idx = items.findIndex((item) => item.key === key);
              setActiveKeyIndex(idx);
            }}
          />
        </div>
        <div className="flex-1 bg-[#F8F9FD] px-8 py-4">
          <Title>{serviceTitle}</Title>

          <ServicePos activeKey={activeKey} bar={currentBar} />
        </div>
      </div>
    </PostLayout>
  );
}

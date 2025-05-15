import { useRouter } from "next/router";
import { Meta } from "@/layouts/Meta";

import CustomTabPos from "@/components/CustomTabPos";
import PostLayout from "@/layouts/PosLayout";
import { TabsProps } from "antd";
import { useState } from "react";
import DiagramPos from "@/modules/pos/diagram/DiagramPos";

import { useQuery } from "@tanstack/react-query";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { getAreaPos, getAreaPosition } from "@/api/area-pos.service";

export default function DiagramPosPage() {
  const [selectArea, setSelectArea] = useState();
  const [seenOption, setSeenOption] = useState("EXTEND");
  const [areaId, setAreaId] = useState(null);
  const branch = useRecoilValue(branchStateSession);
  const router = useRouter();

  const { data: areas } = useQuery(
    ["AREA"],
    () => getAreaPos(Number(branch?.id || router.query.id)),
    {
      onSuccess(response: any) {
        setSelectArea(response?.data[0]);
      },
    }
  );

  const { data, isLoading } = useQuery(
    ["POSITION", areaId],
    () => getAreaPosition(Number(branch?.id), areaId),
    {
      // refetchOnWindowFocus: true,
      refetchInterval: 3000,
    }
  );

  const items: TabsProps["items"] = areas?.data?.map((item) => ({
    key: item?.id,
    ...item,
  }));

  return (
    <PostLayout meta={<Meta title="Doop - Web dashboard" description="Pos" />}>
      <div className="flex">
        <div className="w-[124px] h-screen border-r border-[#FFE6CC] p-4">
          <CustomTabPos
            menu={items}
            setSelectArea={setSelectArea}
            data={areas}
            setAreaId={setAreaId}
          />
        </div>
        <div className="flex-1 bg-[#F8F9FD]">
          <DiagramPos
            data={selectArea}
            seenOption={seenOption}
            setSeenOption={setSeenOption}
            positionData={data?.data?.positions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PostLayout>
  );
}

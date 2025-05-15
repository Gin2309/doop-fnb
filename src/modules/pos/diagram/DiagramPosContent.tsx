import { useState } from "react";
import { Skeleton } from "antd";
import DetailDish from "./components/DetailDish";
import Card from "./components/card/Card";

import ListPosition from "./components/ListPosition";
import { EPositionAction } from "@/enums";

export default function DiagramPosContent({ data, seenOption, isLoading }) {
  const [itemSelect, setItemSelect] = useState<any | undefined>();
  const [openDetailDish, setOpenDetailDish] = useState(false);
  const [openListPosition, setOpenListPosition] = useState(false);
  const [selectPositionId, setSelectPositionId] = useState(null);

  const groupedData = (() => {
    if (!data || !Array.isArray(data)) return [];

    const groupedData: Record<
      string,
      { areaName: string; areaIndex: number; items: any[] }
    > = data.reduce((groups, item) => {
      const { areaName, areaIndex } = item;
      if (!groups[areaName]) {
        groups[areaName] = { areaName, areaIndex, items: [] };
      }
      groups[areaName].items.push(item);
      return groups;
    }, {} as Record<string, { areaName: string; areaIndex: number; items: any[] }>);

    return Object.values(groupedData)
      .sort((a, b) => a.areaIndex - b.areaIndex)
      .map(({ areaName, areaIndex, items }) => ({
        areaName,
        areaIndex,
        items,
      }));
  })();

  return (
    <>
      <div>
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex flex-col gap-2 px-5 mt-3 mb-3">
                  <div className="flex items-center gap-3 mb-6">
                    <Skeleton.Button
                      active
                      size="large"
                      className="w-[150px] h-[40px]"
                    />
                    <div className="flex-1 h-[2px] bg-[#B2B2B2]" />
                  </div>
                  <div className="w-full">
                    {Array(1)
                      .fill(0)
                      .map((_, idx) => (
                        <div key={idx}>
                          <Skeleton active />
                        </div>
                      ))}
                  </div>
                </div>
              ))
          : groupedData?.map((item) => (
              <div className="flex flex-col gap-2 px-5 mb-4">
                <div className="flex items-center gap-3">
                  <p className="py-2 text-lg font-bold">{item?.areaName}</p>
                  <div className="flex-1 h-[2px] bg-[#B2B2B2]" />
                </div>
                <div
                  className={`${
                    seenOption === "EXTEND"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
                      : "flex"
                  } gap-5`}
                >
                  {item?.items?.length > 0 ? (
                    item?.items?.map((item) => (
                      <div key={item.id} className="text-left">
                        <Card
                          data={item}
                          seenOption={seenOption}
                          setOpenListPosition={setOpenListPosition}
                          onClick={() => {
                            setSelectPositionId(item?.id);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-[#B2B2B2] text-lg italic">
                      Khu vực này không có bàn
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
      <DetailDish
        isOpen={openDetailDish}
        onCancel={() => setOpenDetailDish(false)}
        tableData={itemSelect}
      />

      {openListPosition && (
        <ListPosition
          setOpenListPosition={setOpenListPosition}
          seenOption={seenOption}
          currentPosition={selectPositionId}
          type={EPositionAction.TRANSFER}
        />
      )}
    </>
  );
}

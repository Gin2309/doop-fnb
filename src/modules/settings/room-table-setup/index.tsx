import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import {
  deleteManyArea,
  getAreas,
  getCountAreas,
  UpdateIndexArea,
} from "@/api/area.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useWindowSize from "@/hooks/useWindowSize";
import { message, Checkbox } from "antd";
import DeleIcon from "@/assets/deleteRed.svg";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./add-area/components/SortableItem";

const Room = () => {
  const { t } = useTranslation();
  const isSmallScreen = useWindowSize();
  const branch = useRecoilValue(branchStateSession);
  const branchId = branch?.id;
  const queryClient = useQueryClient();

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  const [formFilter, setFormFilter] = useState({
    limit: 10,
    page: 1,
    sort: "",
    branchId: branch?.id,
  });

  const { data: initialAreas } = useQuery(["AREA", formFilter], () =>
    getAreas(formFilter)
  );
  const { data: areaCounts } = useQuery(["AREA_COUNT", branchId], () =>
    getCountAreas({ branchId })
  );

  useEffect(() => {
    if (initialAreas?.data) {
      const sortedAreas = [...initialAreas.data].sort(
        (a, b) => a.position - b.position
      );
      setAreas(sortedAreas);
    }
  }, [initialAreas]);

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedRowKeys((prevKeys) =>
      checked ? [...prevKeys, id] : prevKeys.filter((key) => key !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = areas.map((item) => item.id);
      setSelectedRowKeys(allKeys);
    } else {
      setSelectedRowKeys([]);
    }
  };

  const mutationDelete = useMutation({
    mutationFn: (ids: number[]) => deleteManyArea(ids, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries(["AREA"]);
      message.success("Xóa thành công!");
      setSelectedRowKeys([]);
    },
    onError: () => {
      message.error("Đã xảy ra lỗi khi xóa!");
    },
  });

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length > 0) {
      mutationDelete.mutate(selectedRowKeys);
    } else {
      message.warning("Vui lòng chọn ít nhất một khu vực để xóa!");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = areas.findIndex((item) => item.id === Number(active.id));
    const newIndex = areas.findIndex((item) => item.id === Number(over.id));

    const newAreas = arrayMove(areas, oldIndex, newIndex).map(
      (area, index) => ({
        ...area,
        position: index + 1,
      })
    );

    setAreas(newAreas);

    const updatedIds = newAreas.map((item) => item.id);
    UpdateIndexArea(branchId, updatedIds)
      .then(() => {
        queryClient.invalidateQueries(["AREA"]);
      })
      .catch(() => {
        message.error("Cập nhật vị trí thất bại!");
      });
  };

  return (
    <>
      <div className="bg-white border-t-[1px] h-[72px] shadow-lg flex justify-between items-center px-[20px] w-[calc(100% + 70px)] mx-[-35px]">
        <Title>roomTableSetup</Title>
        <div>
          <Link href={"/settings/room-table-setup/add-area"}>
            <CustomButton
              type="primary"
              wrapClassName="mx-2"
              prefixIcon={<Image src={PlusIcon} />}
              className={`${isSmallScreen ? "no-text" : ""}`}
            >
              {t("addArea")}
            </CustomButton>
          </Link>
        </div>
      </div>

      <div className="bg-white 2xs:p-4 md:p-6 rounded-xl mt-7">
        <h1 className="mb-3">
          Tổng {areaCounts?.data?.countArea} khu vực /
          {areaCounts?.data?.countPosition} bàn
        </h1>

        <div className="flex items-center justify-between p-4 border-b bg-gray-100">
          <div className="flex items-center">
            <Checkbox
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={
                selectedRowKeys.length === areas.length && areas.length > 0
              }
            />
            <div className="w-[25px] ml-3">
              {selectedRowKeys.length > 0 && (
                <div className="cursor-pointer" onClick={handleDeleteSelected}>
                  <Image src={DeleIcon} alt="Delete Icon" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 ml-6 font-bold">{t("areaName")}</div>
          <div className="flex-1 text-center font-bold">
            {t("tableQuantity")}
          </div>
          <div className="flex-1 text-center font-bold">
            {t("tableArrangement")}
          </div>
        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={areas.map((item) => String(item.id))}
            strategy={verticalListSortingStrategy}
          >
            {areas.map((item) => (
              <SortableItem
                key={item.id}
                id={String(item.id)}
                area={item}
                selected={selectedRowKeys.includes(item.id)}
                onSelect={(checked) => handleSelectItem(item.id, checked)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};

export default Room;

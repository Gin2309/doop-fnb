import { CustomButton } from "@/components/CustomButton";
import { CustomCardContent } from "@/components/CustomCardContent";
import Title from "@/components/Title";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useRouter } from "next/router";
import Image from "next/image";
import { Dropdown, MenuProps, message, Space } from "antd";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import Item1 from "@/assets/images/item1.png";
import { CustomInput } from "@/components/CustomInput";
import { CustomCardItem } from "@/components/CustomCardItem";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useEffect, useState } from "react";
import { getMenu, updateIndexMenu } from "@/api/menu.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import _debounce from "lodash/debounce";
import { isIconAvatar } from "@/utils";
import CustomPagination from "@/components/CustomPagination";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <span>Thực đơn 1</span>,
  },
  {
    key: "2",
    label: <span>Thực đơn 2</span>,
  },
  {
    key: "3",
    label: <span>Thực đơn 3</span>,
  },
];

const ProductMenu = () => {
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = branch?.id;
  const [menuData, setMenuData] = useState<any[]>([]);

  const [formFilter, setFormFilter] = useState({
    branchId: branch?.id,
    keyword: "",
  });
  const queryClient = useQueryClient();

  const {
    data: menus,
    isLoading,
    isError,
  } = useQuery(["MENU", formFilter], () => getMenu(formFilter));

  useEffect(() => {
    if (menus?.data) {
      const sortedAreas = [...menus.data].sort(
        (a, b) => a.position - b.position
      );
      setMenuData(sortedAreas);
    }
  }, [menus]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = menuData.findIndex(
      (item) => item.id === Number(active.id)
    );
    const newIndex = menuData.findIndex((item) => item.id === Number(over.id));

    const newMenu = arrayMove(menuData, oldIndex, newIndex).map(
      (area, index) => ({
        ...area,
        position: index + 1,
      })
    );

    setMenuData(newMenu);

    const updatedIds = newMenu.map((item) => item.id);
    updateIndexMenu(branchId, updatedIds)
      .then(() => {
        queryClient.invalidateQueries(["MENU"]);
      })
      .catch(() => {
        message.error("Cập nhật vị trí thất bại!");
      });
  };

  return (
    <>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <p className="text-2xl font-semibold">Thực đơn</p>
        <CustomButton
          type="primary"
          wrapClassName="mx-2"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push("/products/menu/add")}
        >
          Thêm thực đơn
        </CustomButton>
      </div>

      <CustomCardItem className="mx-5">
        <div className="p-5 mb-20 mt-4 ">
          <div className="flex items-center">
            <Space.Compact block>
              <CustomInput
                placeholder="Tìm kiếm "
                prefixIcon={<Image src={SearchIcon} alt="" />}
                className="w-[266px] h-[36px]"
                onChange={_debounce((value) => {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    keyword: value,
                  }));
                }, 300)}
              />
            </Space.Compact>
          </div>

          <div className="flex flex-col gap-[15px] mt-[25px]">
            {menus?.data?.length > 0 ? (
              <>
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={menuData.map((item) => String(item.id))}
                    strategy={verticalListSortingStrategy}
                  >
                    {menuData.map((item, index) => (
                      <SortableItem
                        key={item.id}
                        id={String(item.id)}
                        item={item}
                        index={index}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </>
            ) : (
              <div className="text-center mt-5 text-lg p-5 text-[#9999]">
                Thực đơn trống
              </div>
            )}
          </div>
        </div>
      </CustomCardItem>
    </>
  );
};

export default ProductMenu;

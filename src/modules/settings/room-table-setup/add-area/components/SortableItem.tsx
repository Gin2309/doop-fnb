import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Checkbox } from "antd";
import DoteNine from "@/assets/DotsNine.svg";
import { useRouter } from "next/router";

export const SortableItem = ({ id, area, selected, onSelect }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const router = useRouter();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleNavigate = () => {
    router.push(`/settings/room-table-setup/add-area/?id=${area.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 border-b-2 hover:bg-gray-100 ${
        selected ? "bg-blue-50" : ""
      }`}
    >
      <div className="mr-5">
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>
      <div className="flex-1 ml-10" onClick={handleNavigate}>
        <h1
          className="text-[#3355FF] cursor-pointer font-[500] block text-line-1"
          title={area.name}
        >
          {area.name}
        </h1>
      </div>
      <div className="flex-1 text-center">{area.count}</div>
      <div
        className="flex-1 gap-2 flex justify-center cursor-pointer"
        {...listeners}
        {...attributes}
      >
        <Image src={DoteNine} />
      </div>
    </div>
  );
};

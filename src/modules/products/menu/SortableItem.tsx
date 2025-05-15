import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Checkbox } from "antd";
import DoteNine from "@/assets/DotsNine.svg";
import { useRouter } from "next/router";
import { isIconAvatar } from "@/utils";

export const SortableItem = ({ id, item, selected, onSelect, index }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const router = useRouter();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={index}
      ref={setNodeRef}
      style={style}
      className="bg-[#F9FAFD] flex items-center justify-between gap-[18px] py-[15px] px-[20px] rounded-[16px] cursor-pointer"
      onClick={() => router.push(`/products/menu/${item.id}`)}
    >
      <div className=" flex items-center gap-[18px]">
        <span className="mr-[10px]">{`${index + 1}`}</span>
        {isIconAvatar(item.avatarUrl) ? (
          <Image
            width={60}
            height={60}
            src={`/images/icon/${item.avatarUrl}.png`}
            alt={`Icon ${index + 1}`}
            className="w-[66px] h-[66px]"
          />
        ) : (
          <Image
            width={60}
            height={60}
            alt="cafe"
            src={item.avatarUrl || "/images/services1.png"}
          />
        )}
        <div>
          <span className="text-[#3355FF] font-semibold py-[3px] ">
            {item?.name}
          </span>
          <p className="text-[#333333] ">
            {item?.countProduct} mặt hàng, {item?.countCombo} combo
          </p>
        </div>
      </div>

      <div className="mr-10" {...listeners} {...attributes}>
        <Image src={DoteNine} />
      </div>
    </div>
  );
};

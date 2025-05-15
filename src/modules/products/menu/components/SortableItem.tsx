import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Checkbox } from "antd";
import DoteNine from "@/assets/DotsNine.svg";
import { useRouter } from "next/router";
import { formatCurrency, isColorAvatar } from "@/utils";
import ArrownCardIcon from "@/assets/arrowsOutCard.svg";
import XIcon from "@/assets/X.svg";

export const SortableItem = ({ id, item, index, removeProduct }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const router = useRouter();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center p-[15px]"
    >
      <div className="flex items-center gap-[20px]">
        <span className="mr-[20px]">{index + 1}</span>
        {isColorAvatar(item?.avatarUrl) ? (
          <div
            className="w-[60px] h-[60px] rounded-lg"
            style={{ backgroundColor: item?.avatarUrl }}
          />
        ) : (
          <Image
            width={60}
            height={60}
            alt={item?.name}
            src={item?.avatarUrl || "/images/services1.png"}
          />
        )}
        <span className="text-[#3355FF] font-semibold py-[3px] ">
          {item?.name}
        </span>
      </div>
      <div className="flex items-center gap-[15px]">
        <span>
          {item?.variants
            ? item?.variants.length > 1
              ? `${item?.variants.length} giá`
              : formatCurrency(item?.variants[0]?.price)
            : formatCurrency(item?.price)}
        </span>
        <div {...listeners} {...attributes}>
          <Image
            src={ArrownCardIcon}
            alt="Arrow Icon"
            className="cursor-pointer"
          />
        </div>
        <div
          className="p-3 flex items-center justify-center cursor-pointer"
          onClick={() => removeProduct(item)}
        >
          <Image src={XIcon} />
        </div>
      </div>
    </div>
  );
};

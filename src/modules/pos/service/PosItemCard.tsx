import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import CancelIcon from "@/assets/XCircle.svg";
import CaretDoubleRight from "@/assets/CaretDoubleRight.svg";
import { PropsWithoutRef } from "react";
import KDSItem from "@/shared/models/KDSItem";
import { calculateCreatedTime, calculateCreatedTimeColor, formatTime } from "@/utils";

const PosItemCard = (props: PropsWithoutRef<{
  item: KDSItem;
  onOK?(item: KDSItem): void;
  onCancel?(item: KDSItem): void;
  cancelText?: string;
}>) => {
  const {
    item,
    onOK = () => {},
    onCancel = () => {},
    cancelText = "Từ chối"
  } = props;

  const meta = calculateCreatedTimeColor(item.cookTime || new Date());

  return <div className="flex flex-col gap-3">
    <div className="flex p-3 flex-wrap">
      
      <div className="flex gap-3 basis-1/3 grow-0">
        <div className={`w-6 h-6 bg-[${meta.color}] rounded-full flex-shrink-0`} />
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">
            <span className="text-[#E92215] text-lg font-semibold">
              {item.quantity || 0} x{" "}
            </span>
            {item.product?.name ?? ""}
          </p>
          <p className="text-sm text-[#0094FF]">
            {item.variant?.name ?? ""}
          </p>
          {!!item.openSelects?.length && <div className="py-2">
            {item.openSelects.map((opt, idx) => {
              return <p key={`${item.id}-${idx}`} className="text-[#FF00BB]">
                {`+ ${opt.quantity} ${opt.selection?.name}`}
              </p>
            })}
          </div>}
          <p className="text-sm text-[#666666]">
            {item.code} - {formatTime(item.createdAt)} - Bởi {item.creatorName}
          </p>
        </div>
      </div>


      <div className="flex gap-3 basis-2/3 grow-0 justify-between">
        <div>
          <p className="text-sm font-semibold">{item.positionName}</p>
          <p className="text-sm text-[#666666]">{calculateCreatedTime(item.updatedAt)}</p>
        </div>
        <div className="flex gap-5">
          <CustomButton
            prefixIcon={<Image src={CancelIcon} />}
            className="!bg-[#FFECEB] text-[#E92215] font-semibold"
            type="danger"
            onClick={() => onCancel(item)}
          >
            {cancelText}
          </CustomButton>

          <CustomButton
            suffixIcon={<Image src={CaretDoubleRight} />}
            type="primary"
            className=" font-semibold"
            onClick={() => onOK(item)}
          >
            Xong
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
}

export default PosItemCard;
import { CustomButton } from "@/components/CustomButton";
import CaretDoubleLeft from "@/assets/CaretDoubleLeft.svg";
import CaretDoubleRight from "@/assets/CaretDoubleRight.svg";
import Image from "next/image";
import {
  getKdsServingItem,
  updateKdsServed,
  updateKdsUndo,
} from "@/api/kds.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { calculateCreatedTime, formatTime } from "@/utils";
import { useState } from "react";
import CustomModalChangeStatus from "../ModalKds";

// Chế biến xong/Chờ phục vụ
export default function Done({ queryParams }) {
  const router = useRouter();
  const { barId } = router.query;
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const [openChangeStatus, setOpenChangeStatus] = useState<{
    visible: boolean;
    content: string;
    action: (() => void) | null;
  }>({
    visible: false,
    content: "",
    action: null,
  });

  const { data: servings } = useQuery(
    ["KDS-ITEM", branch?.id, barId],
    () =>
      getKdsServingItem({
        branchId: Number(branch?.id),
        barId: barId ? Number(barId) : undefined,
      }),
    { enabled: !!branch?.id }
  );

  const { mutate: markAsServingItem } = useMutation(
    (id: number) => updateKdsServed(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS-ITEM"]);
        queryClient.invalidateQueries(["KDS-SERVING"]);
        message.success("Thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: undoMutation } = useMutation(
    (id: number) => updateKdsUndo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS-PAYMENT"]);
        queryClient.invalidateQueries(["KDS-ITEM"]);
        queryClient.invalidateQueries(["KDS"]);
        message.success("Hoàn tác thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleActionSubmit = () => {
    if (openChangeStatus.action) {
      openChangeStatus.action();
      setOpenChangeStatus({ visible: false, content: "", action: null });
    }
  };

  const onRejectClick = (item) => {
    setOpenChangeStatus({
      visible: true,
      content: "Bạn có chắc muốn hoàn món ăn này không?",
      action: () => undoMutation(item.id),
    });
  };

  return (
    <div className="h-screen w-full">
      <div className="flex gap-10 p-3 pb-0 h-[52px]">
        <p className="text-white pl-4 text-[18px] font-semibold whitespace-nowrap">
          Chế biến xong/ Chờ phục vụ
        </p>
      </div>
      <div className="bg-white rounded-t-[16px] p-3 min-h-[1000vh]">
        <div className="flex flex-col gap-3 ">
          {servings?.data?.map((item) => (
            <div
              key={item?.id}
              className="flex sm:flex-col lg:flex-row justify-between gap-6 p-3 border-b border-dashed"
            >
              <div className="flex sm:flex-col lg:flex-row gap-2">
                {queryParams?.isBarId && (
                  <CustomButton
                    prefixIcon={<Image src={CaretDoubleLeft} />}
                    className="!bg-[#FFECEB] text-md !w-[120px] text-[#E92215] font-semibold"
                    type="danger"
                    onClick={() => onRejectClick(item)}
                  >
                    Hoàn tác
                  </CustomButton>
                )}

                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold">
                    <span className="text-[#E92215] text-md font-semibold pr-2">
                      {item?.quantity} {""} x
                    </span>
                    {item?.product?.name}
                  </p>
                  <p className="text-md text-[#0094FF]">
                    {item?.variant?.name}
                  </p>
                  <p className="text-md text-[#666666] ">
                    {item?.code} - {formatTime(item?.createdAt)} -{" "}
                    {item?.creatorName}
                  </p>
                </div>
              </div>

              {!queryParams?.isBarId && (
                <div className="min-w-[100px]">
                  <p className="text-md font-semibold whitespace-nowrap">
                    {item?.positionName}
                  </p>
                  <p className="text-md text-[#666666]">
                    {calculateCreatedTime(item?.updatedAt)}
                  </p>
                </div>
              )}

              {!queryParams?.isBarId && (
                <div className="flex gap-5">
                  <CustomButton
                    suffixIcon={<Image src={CaretDoubleRight} />}
                    type="green-btn"
                    className="!w-[110px] font-semibold"
                    onClick={() => markAsServingItem(item?.id)}
                  >
                    Xong
                  </CustomButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {openChangeStatus && (
        <CustomModalChangeStatus
          isVisible={openChangeStatus.visible}
          setIsVisible={(newState) =>
            setOpenChangeStatus((prev) => ({ ...prev, visible: newState }))
          }
          title="Hoàn món?"
          content={openChangeStatus.content}
          action="Hoàn món"
          onSubmit={handleActionSubmit}
        />
      )}
    </div>
  );
}

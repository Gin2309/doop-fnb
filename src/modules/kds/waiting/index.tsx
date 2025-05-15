import React, { useState } from "react";
import { CustomButton } from "@/components/CustomButton";
import CustomTabSelect from "@/components/CustomTabSelect";

import CancelIcon from "@/assets/XCircle.svg";
import CaretDoubleRight from "@/assets/CaretDoubleRight.svg";
import Image from "next/image";
import {
  deleteKdsRejected,
  getAllKdsBar,
  getGroupItem,
  updateKdsServing,
  updateKdsServingVariants,
  updateKdsUndo,
} from "@/api/kds.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { message } from "antd";
import { useRouter } from "next/router";
import { calculateCreatedTimeColor, formatTime } from "@/utils";
import CaretDoubleLeft from "@/assets/CaretDoubleLeft.svg";
import CustomModalChangeStatus from "../ModalKds";

export default function Waiting({ queryParams }) {
  const tabs = ["Thứ tự đơn", "Ưu tiên", "Theo món"];
  const [activeTab, setActiveTab] = useState(0);

  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { barId } = router.query;

  const [openChangeStatus, setOpenChangeStatus] = useState<{
    visible: boolean;
    content: string;
    action: (() => void) | null;
  }>({
    visible: false,
    content: "",
    action: null,
  });

  const { data: bars } = useQuery(
    ["KDS", branch?.id, barId, activeTab],
    () =>
      getAllKdsBar({
        branchId: Number(branch?.id),
        barId: barId ? Number(barId) : undefined,
        sort: activeTab === 1 ? "cookTime" : undefined,
      }),
    { enabled: !!branch?.id }
  );

  const { data: groups } = useQuery(
    ["GROUP_ITEM", branch?.id, barId],
    () =>
      getGroupItem({
        branchId: Number(branch?.id),
        barId: barId ? Number(barId) : undefined,
      }),
    { enabled: !!branch?.id }
  );

  const { mutate: markAsServedItem } = useMutation(
    (id: number) => updateKdsServing(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS"]);
        queryClient.invalidateQueries(["KDS-ITEM"]);
        message.success("Đã chế biến xong");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: rejectedKds } = useMutation(
    (id: number) => deleteKdsRejected(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS"]);
        queryClient.invalidateQueries(["KDS-ITEM"]);
        message.success("Thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
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
      content: "Bạn có chắc muốn từ chối món ăn này không?",
      action: () => rejectedKds(item.id),
    });
  };

  const { mutate: servingVariant } = useMutation(
    ({ barId, variantId }: { barId: number; variantId: number }) =>
      updateKdsServingVariants({ barId, variantId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS"]);
        queryClient.invalidateQueries(["GROUP_ITEM"]);
        message.success("Đã cập nhật thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: undoMutation } = useMutation(
    (id: number) => updateKdsUndo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS-PAYMENT"]);
        queryClient.invalidateQueries(["KDS"]);
        queryClient.invalidateQueries(["KDS-ITEM"]);
        message.success("Hoàn tác thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0: // Thứ tự đơn
        return (
          <div className="flex flex-col gap-3">
            {bars?.data?.map((item) => {
              const { color, timeText } = calculateCreatedTimeColor(
                item?.cookTime
              );
              return (
                <div
                  key={item?.id}
                  className="flex sm:flex-col lg:flex-row justify-between gap-3 p-3 overflow-hidden border-b border-dashed"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-row gap-1">
                      {queryParams?.isPendingPayment && (
                        <CustomButton
                          prefixIcon={<Image src={CaretDoubleLeft} />}
                          className="!bg-[#FFECEB] text-md !w-[120px] text-[#E92215] font-semibold"
                          type="danger"
                          onClick={() => undoMutation(item?.id)}
                        >
                          Hoàn tác
                        </CustomButton>
                      )}
                      <div
                        className="w-[24px] h-[24px] max-w-[100%] rounded-full px-3 text-[#fff]"
                        style={{ backgroundColor: color }}
                      >
                        {""}
                      </div>
                      <div className="pl-3">
                        <p className="text-md font-semibold">
                          <span className="text-[#E92215] text-md font-semibold pr-2">
                            {item?.quantity} {""} x
                          </span>
                          {item?.product?.name}
                        </p>
                        <p className="text-md text-[#0094FF] ">
                          {item?.variant?.name}
                        </p>
                        <div className="py-2">
                          {item?.openSelects?.map((i) => {
                            return (
                              <p className="text-[#FF00BB]">{`+ ${i.quantity} ${i?.selection?.name}`}</p>
                            );
                          })}
                        </div>
                        <p className="text-md text-[#666666]">
                          {item?.code} - {formatTime(item?.createdAt)} - {""}
                          {item?.creatorName}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!queryParams?.isPendingPayment &&
                    !queryParams?.isBringServe && (
                      <div className="min-w-[100px]">
                        <p className="text-md font-semibold whitespace-nowrap">
                          {item?.positionName}
                        </p>
                        <p className="text-md text-[#666666]"> {timeText}</p>
                      </div>
                    )}
                  {!queryParams?.isPendingPayment &&
                    !queryParams?.isBringServe && (
                      <div className="flex lg:flex-row sm:flex-col gap-5">
                        <CustomButton
                          prefixIcon={<Image src={CancelIcon} />}
                          className="!bg-[#FFECEB] !w-[100px] !p-0 !h-[40px] text-[#E92215] font-semibold"
                          type="danger"
                          onClick={() => onRejectClick(item)}
                        >
                          Từ chối
                        </CustomButton>

                        <CustomButton
                          suffixIcon={<Image src={CaretDoubleRight} />}
                          type="primary"
                          className=" !w-[100px] !h-[40px] font-semibold"
                          onClick={() => markAsServedItem(item?.id)}
                        >
                          Xong
                        </CustomButton>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        );
      case 1: // Ưu tiên
        return (
          <div className="flex flex-col gap-3">
            {bars?.data?.map((item) => {
              const { color, timeText } = calculateCreatedTimeColor(
                item?.cookTime
              );
              return (
                <div
                  key={item?.id}
                  className="flex sm:flex-col lg:flex-row justify-between gap-3 p-3 overflow-hidden border-b border-dashed"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-row gap-1">
                      <div
                        className="w-[24px] h-[24px] max-w-[100%] rounded-full px-3 text-[#fff]"
                        style={{ backgroundColor: color }}
                      >
                        {""}
                      </div>
                      <div className="pl-3">
                        <p className="text-md font-semibold ">
                          <span className="text-[#E92215] text-md font-semibold pr-2">
                            {item?.quantity} {""} x
                          </span>
                          {item?.product?.name}
                        </p>
                        <p className="text-md text-[#0094FF] ">
                          {item?.variant?.name}
                        </p>
                        <p className="text-md text-[#666666]">
                          {item?.code} - {formatTime(item?.createdAt)} - {""}
                          {item?.creatorName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-md font-semibold whitespace-nowrap">
                      {item?.positionName}
                    </p>
                    <p className="text-md text-[#666666]"> {timeText}</p>
                  </div>
                  <div className="flex lg:flex-row sm:flex-col gap-5">
                    <CustomButton
                      prefixIcon={<Image src={CancelIcon} />}
                      className="!bg-[#FFECEB] !p-0 !w-[100px] !h-[40px] text-[#E92215] font-semibold"
                      type="danger"
                      onClick={() => onRejectClick(item)}
                    >
                      Từ chối
                    </CustomButton>

                    <CustomButton
                      suffixIcon={<Image src={CaretDoubleRight} />}
                      type="primary"
                      className=" !w-[100px] !h-[40px] font-semibold"
                      onClick={() => markAsServedItem(item?.id)}
                    >
                      Xong
                    </CustomButton>
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 2: // Theo món
        return (
          <div className="flex flex-col gap-3">
            {groups?.data?.map((item) => {
              return (
                <div
                  key={item?.id}
                  className="flex sm:flex-col lg:flex-row justify-between gap-3 p-3 overflow-hidden border-b border-dashed"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-row gap-1">
                      <div className="pl-3">
                        <p className="text-md font-semibold">
                          <span className="text-[#E92215] text-md font-semibold pr-2">
                            {item?.quantity} {""} x
                          </span>
                          {item?.productName}
                        </p>
                        <p className="text-md text-[#0094FF] ">
                          {item?.variantName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-row !p-0 sm:flex-col gap-5">
                    <CustomButton
                      prefixIcon={<Image src={CancelIcon} />}
                      className="!bg-[#FFECEB] !p-0 !w-[100px] !h-[40px] text-[#E92215] font-semibold"
                      type="danger"
                      onClick={() => rejectedKds(item?.id)}
                    >
                      Từ chối
                    </CustomButton>

                    <CustomButton
                      suffixIcon={<Image src={CaretDoubleRight} />}
                      type="primary"
                      className=" !w-[100px] !h-[40px] font-semibold"
                      onClick={() =>
                        servingVariant({
                          barId: Number(barId) || item?.barId,
                          variantId: item?.variantId,
                        })
                      }
                    >
                      Xong
                    </CustomButton>
                  </div>
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex gap-5 justify-between p-3 pb-0 h-[52px]">
        <p className="text-white pl-4 text-[18px] font-semibold whitespace-nowrap">
          Chờ chế biến
        </p>
        {!queryParams?.isPendingPayment && !queryParams?.isBringServe && (
          <CustomTabSelect
            menu={tabs}
            defaultIndex={0}
            onTabChange={(index) => setActiveTab(index)}
          />
        )}
      </div>

      <div className="bg-white rounded-t-[16px] p-3 min-h-[1000vh]">
        {renderContent()}
      </div>

      {openChangeStatus && (
        <CustomModalChangeStatus
          isVisible={openChangeStatus.visible}
          setIsVisible={(newState) =>
            setOpenChangeStatus((prev) => ({ ...prev, visible: newState }))
          }
          title="Từ chối chế biến?"
          content={openChangeStatus.content}
          action="Từ chối"
          onSubmit={handleActionSubmit}
        />
      )}
    </div>
  );
}

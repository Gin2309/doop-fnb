import Image from "next/image";
import { Meta } from "@/layouts/Meta";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import CustomTabPos from "@/components/CustomTabPos";
import PostLayout from "@/layouts/PosLayout";
import { message, Skeleton, TabsProps } from "antd";
import Card from "./card/Card";
import ModalPos from "@/components/CustomModal/ModalPos";
import { EPositionAction } from "@/enums";
import { customMessage } from "@/utils/messageHelper";

import ArrowLeft from "@/assets/ArrowLeft.svg";

import { branchStateSession } from "@/recoil/state";
import {
  createPositonOpen,
  getAreaPos,
  getAreaPosition,
  mergePosition,
  splitPosition,
  transferPosition,
} from "@/api/area-pos.service";
import { addSelection, transferItem } from "@/api/current-bill-item.service";
import ModalOpenTable from "../ModalOpenTable";

export default function ListPosition({
  setOpenListPosition,
  seenOption,
  currentPosition,
  type,
  productSplitChecked,
  transferData,
  setTransferItem,
  setOpenTransferItem,
  currentBill
}: {
  setOpenListPosition: any;
  seenOption: any;
  currentPosition?: any;
  type: any;
  productSplitChecked?: any;
  transferData?: any;
  setTransferItem?: any;
  setOpenTransferItem?: any;
  currentBill?: any;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const [selectArea, setSelectArea] = useState<any>();
  const [newPositionId, setNewPositionId] = useState(null);
  const [newPosition, setNewPosition] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [areaId, setAreaId] = useState(null);
  const [openTableOnTransfer, setOpenTableOnTransfer] = useState(false);
  const [openTableAfterTransfer, setOpenTableAfterTransfer] = useState(false);

  const { data: areas } = useQuery(
    ["AREA"],
    () => getAreaPos(Number(branch?.id)),
    {
      onSuccess(response: any) {
        setSelectArea(response?.data[0]);
      },
    }
  );

  const { data: positionData, isLoading } = useQuery(
    ["POSITION", areaId],
    () => getAreaPosition(Number(branch?.id), areaId),
    {
      refetchOnWindowFocus: true,
    }
  );

  const data = positionData?.data?.positions;

  const items: TabsProps["items"] = areas?.data?.map((item) => ({
    key: item?.id,
    ...item,
  }));

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

  const { mutateAsync: mutateTransfer } = useMutation(
    (data: any) => transferPosition(data),
    {
      onMutate: () => {
        message.loading({ content: "Đang di chuyển bàn...", key: "loading" });
      },
      // onMutate: () => {
      //   customMessage.loading("Đang di chuyển bàn...", "loading");
      // },
      onSuccess: async () => {
        // setOpenTableAfterTransfer(true);
        // await queryClient.invalidateQueries(["AREA"]);
        // await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        // message.success({
        //   content: "Di chuyển bàn thành công",
        //   key: "loading",
        // });
        // setNewPositionId(null);
        // setNewPosition(null);
        // setOpenListPosition(false);
        // router.push(`/pos/diagram/${newPositionId}`);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error({ content: errorMessage, key: "loading" });
      },
    }
  );

  const { mutate: mutateMerge } = useMutation(
    (data: any) => mergePosition(data),
    {
      onMutate: () => {
        message.loading({ content: "Đang gộp bàn...", key: "loading" });
      },
      // onMutate: () => {
      //   customMessage.loading("Đang gộp bàn...", "loading");
      // },
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        message.success({ content: "Gộp bàn thành công", key: "loading" });
        setOpenListPosition(false);
        router.push(`/pos/diagram/${newPositionId}`);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error({ content: errorMessage, key: "loading" });
      },
    }
  );

  const { mutate: mutateSplit } = useMutation(
    (data: any) => splitPosition(data),
    {
      onMutate: () => {
        message.loading({ content: "Đang tách bàn...", key: "loading" });
      },
      // onMutate: () => {
      //   customMessage.loading("Đang tách bàn...", "loading");
      // },
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        await queryClient.invalidateQueries(["DETAIL_POSITION"]);
        message.success({ content: "Tách bàn thành công", key: "loading" });
        setOpenListPosition(false);
        router.push(`/pos/diagram/${currentPosition}`);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error({ content: errorMessage, key: "loading" });
      },
    }
  );

  const { mutate: transferMutation } = useMutation(
    (data: any) => transferItem(transferData?.id, data),
    {
      // onMutate: () => {
      //   customMessage.loading("Đang chuyển sản phẩm...", "loading");
      // },
      onSuccess: () => {
        customMessage.success("Thao tác thành công");
        setTransferItem(null);
        setOpenTransferItem(false);
        router.push(`/pos/diagram`);
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const { mutateAsync: mutateAddItemToNewPos } = useMutation(
    ({ billId, payload }: { billId: string; payload: any }) => addSelection(billId, payload),
    { 
      onSuccess: () => {

      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Có lỗi khi khởi tạo bàn mới";
        message.error(errorMessage);
      }
    }
)

  const handleCancelTransferTable = () => {
    setNewPositionId(null);
    setNewPosition(null);
    setOpenListPosition(false);
  }

  const handleAddItemAfterTransfer = async () => {
    await queryClient.invalidateQueries(["AREA"]);
    await queryClient.invalidateQueries(["DETAIL_POSITION"]);
    message.success({
      content: "Di chuyển bàn thành công",
      key: "loading",
    });
    handleCancelTransferTable();
    router.push(`/pos/diagram/${newPositionId}`);
  }

  const handleTransferItems = () => {
    const { id, ...dataWithoutId } = transferData;

    const submitedData = {
      ...dataWithoutId,
      targetPositionId: newPositionId,
    };
    transferMutation(submitedData);
  };

  const onSubmitTransfer = async () => {
    const dataMutate = {
      currentPositionId: currentPosition,
      newPositionId: newPositionId,
      branchId: branch?.id,
    };
    return mutateTransfer(dataMutate);
  };

  const onSubmitMerge = () => {
    const dataMutate = {
      currentPositionId: currentPosition,
      newPositionId: newPositionId,
      branchId: branch?.id,
    };
    mutateMerge(dataMutate);
  };

  const onSubmitSplit = () => {
    const dataMutate = {
      sourcePositionId: currentPosition,
      targetPositionId: newPositionId,
      itemsToTransfer: productSplitChecked,
      branchId: branch?.id,
    };
    mutateSplit(dataMutate);
  };

  const actionTitles = {
    [EPositionAction.TRANSFER]: "Chuyển bàn",
    [EPositionAction.MERGE]: "Gộp bàn",
    [EPositionAction.SPLIT]: "Tách bàn",
    [EPositionAction.TRANSFER_ITEMS]: "Chuyển sản phẩm",
  };

  const actionContents = {
    [EPositionAction.TRANSFER]: "Bạn có chắc chắn muốn chuyển bàn?",
    [EPositionAction.MERGE]: "Bạn có chắc chắn muốn gộp bàn?",
    [EPositionAction.SPLIT]: "Bạn có chắc chắn muốn tách bàn?",
    [EPositionAction.TRANSFER_ITEMS]: "Bạn có chắc chắn muốn chuyển sản phẩm",
  };

  const onSubmit = {
    [EPositionAction.TRANSFER]: onSubmitTransfer,
    [EPositionAction.MERGE]: onSubmitMerge,
    [EPositionAction.SPLIT]: onSubmitSplit,
    [EPositionAction.TRANSFER_ITEMS]: handleTransferItems,
  };

  return (
    <>
      <div className="absolute top-0 bottom-0 right-0 left-0 bg-white">
        <PostLayout
          meta={<Meta title="Doop - Web dashboard" description="Pos" />}
        >
          <div className="flex bg-white">
            <div className="w-[124px] h-screen border-r border-[#FFE6CC] p-4">
              <CustomTabPos
                menu={items}
                setSelectArea={setSelectArea}
                data={areas}
                setAreaId={setAreaId}
              />
            </div>
            <div className="flex-1 bg-[#F8F9FD]">
              <div
                className="flex items-center gap-2 py-2 ml-4 cursor-pointer"
                onClick={() => {
                  setOpenListPosition(false);
                  setTransferItem(null);
                }}
              >
                <Image src={ArrowLeft} />
                <p>Quay lại </p>
              </div>
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 px-5 mt-3 mb-3"
                      >
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
                        <p className="py-2 text-lg font-bold">
                          {item?.areaName}
                        </p>
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
                          item?.items?.filter(i => 
                            [EPositionAction.TRANSFER, EPositionAction.MERGE].includes(type)
                            && typeof currentPosition !== "undefined"
                            && i.id?.toString() !== currentPosition
                          )?.map((item) => (
                            <div key={item.id} className="text-left">
                              <Card
                                onClick={() => {
                                  setNewPositionId(item?.id);
                                  setNewPosition(item);
                                  setOpenTableOnTransfer(true);
                                  // setIsOpenModal(true);
                                }}
                                data={item}
                                seenOption={seenOption}
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
          </div>
        </PostLayout>
      </div>
      <ModalPos
        isOpen={isOpenModal}
        onCancel={() => {
          setNewPositionId(null);
          setNewPosition(null);
          setIsOpenModal(false);
          setTransferItem(null);
          setOpenListPosition(false);
        }}
        title={actionTitles[type] || ""}
        content={actionContents[type] || ""}
        onSuccess={() => {
          if (type === EPositionAction.TRANSFER) {
            onSubmitTransfer();
          } else if (type === EPositionAction.MERGE) {
            onSubmitMerge();
          } else if (type === EPositionAction.SPLIT) {
            onSubmitSplit();
          } else if (type === EPositionAction.TRANSFER_ITEMS) {
            handleTransferItems();
          } else {
            console.error(`Invalid action type: ${type}`);
          }
        }}
      />
      {!!newPosition && <ModalOpenTable 
        positionSelect={newPosition}
        openModal={openTableOnTransfer}
        setOpenModal={setOpenTableOnTransfer}
        tableId={newPositionId}
        branchId={branch?.id}
        customSubmitFn={(data) => {
          // TODO: Fix API
          onSubmitTransfer().then(() => {
            if (!currentBill) handleAddItemAfterTransfer();
            else {
              const payload = {
                branchId: data.branchId,
                items: (data.itemsRequest ?? []).map((item) => ({
                  ...item
                }))
              }
              mutateAddItemToNewPos({ billId: currentBill.id, payload }).finally(() => {
                handleAddItemAfterTransfer();
              })
            }
          })
        }}
        onCancel={handleCancelTransferTable}
      />}
    </>
  );
}

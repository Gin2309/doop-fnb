import { getKdsServingItem, updateKdsServed, updateKdsUndo } from "@/api/kds.service";
import { branchStateSession } from "@/recoil/state";
import KDSItem from "@/shared/models/KDSItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import PosItemCard from "../PosItemCard";
import PosItemCardContainer from "../PosItemCardContainer";
import CustomModalChangeStatus from "@/modules/kds/ModalKds";

const PosServiceToServed = () => {
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);

  const { data: servingRes } = useQuery(["KDS-ITEM", branch?.id], () => {
    return getKdsServingItem({ branchId: branch?.id });
  }, { enabled: !!branch?.id });

  const items = servingRes?.data ?? [];

  const [openChangeStatus, setOpenChangeStatus] = useState<{
    visible: boolean; content: string; action: Function | null;
  }>({
    visible: false, content: "", action: null,
  });

  const { mutate: undoMutation } = useMutation(
    (id: number) => updateKdsUndo(id),
    {
      onSuccess: () => {
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

  const { mutate: markAsServedItem } = useMutation(
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

  const onRejectClick = (item: KDSItem) => {
    setOpenChangeStatus({
      visible: true,
      content: "Bạn có chắc muốn hoàn món ăn này không?",
      action: () => undoMutation(item.id),
    });
  };

  const handleActionSubmit = () => {
    if (openChangeStatus.action) {
      openChangeStatus.action();
      setOpenChangeStatus({ visible: false, content: "", action: null });
    }
  };

  return <>
    <div className="card">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return <PosItemCardContainer key={item.id} isLast={isLast}>
          <PosItemCard
            item={item}
            cancelText="Hoàn tác"
            onCancel={(item) => onRejectClick(item)}
            onOK={(item) => markAsServedItem(item.id)}
          />
        </PosItemCardContainer>
      })}
    </div>

    <CustomModalChangeStatus
      isVisible={openChangeStatus.visible}
      setIsVisible={(v) =>
        setOpenChangeStatus((prev) => ({ ...prev, visible: v }))
      }
      title="Hoàn món?"
      content={openChangeStatus.content}
      action="Hoàn món"
      onSubmit={handleActionSubmit}
    />
  </>
}

export default PosServiceToServed;
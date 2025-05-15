import { deleteKdsRejected, getAllKdsBar, updateKdsServing } from "@/api/kds.service";
import { branchStateSession } from "@/recoil/state";
import Bar from "@/shared/models/Bar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropsWithoutRef, useState } from "react";
import { useRecoilValue } from "recoil";
import PosItemCard from "../PosItemCard";
import PosItemCardContainer from "../PosItemCardContainer";
import KDSItem from "@/shared/models/KDSItem";
import { message } from "antd";
import CustomModalChangeStatus from "@/modules/kds/ModalKds";

const PosServiceOnBar = (props: PropsWithoutRef<{
  bar: Bar;
}>) => {
  const {
    bar
  } = props;
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);

  const { data: barsKdsRes } = useQuery(["KDS", branch?.id, bar.id], () => {
    return getAllKdsBar({
      branchId: +branch?.id,
      barId: bar.id
    })
  }, { enabled: !!branch?.id });

  const items = barsKdsRes?.data ?? [];

  const [openChangeStatus, setOpenChangeStatus] = useState<{
    visible: boolean; content: string; action: Function | null;
  }>({
    visible: false, content: "", action: null
  })

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

  const onRejectClick = (item: KDSItem) => {
    setOpenChangeStatus({
      visible: true,
      content: "Bạn có chắc muốn từ chối món ăn này không?",
      action: () => rejectedKds(item.id)
    })
  }

  const handleActionSubmit = () => {
    if (openChangeStatus.action) {
      openChangeStatus.action();
      setOpenChangeStatus({ visible: false, content: "", action: null });
    }
  };

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

  return <>
    <div className="card">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return <PosItemCardContainer key={item.id} isLast={isLast}>
          <PosItemCard
            item={item}
            onCancel={(item) => onRejectClick(item)}
            onOK={(item) => markAsServedItem(item.id)}
          />
        </PosItemCardContainer>
      })}
    </div>

    <CustomModalChangeStatus
      isVisible={openChangeStatus.visible}
      setIsVisible={(v) => {
        setOpenChangeStatus((prev) => ({ ...prev, visible: v }))
      }}
      title="Từ chối chế biến?"
      content={openChangeStatus.content}
      action="Từ chối"
      onSubmit={handleActionSubmit}
    />
  </>
}

export default PosServiceOnBar;
import { getKdsPaymentPending, updateKdsPending } from "@/api/kds.service";
import KdsNotifi from "@/assets/kds-notifi.svg";
import { branchStateSession } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, notification } from "antd";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import PosItemCard from "../PosItemCard";
import PosItemCardContainer from "../PosItemCardContainer";


const PosServiceWaiting = () => {
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);
  const [api, contextHolder] = notification.useNotification();

  const { data: paymentKdsRes } = useQuery(["KDS-PAYMENT", branch?.id], () => {
    return getKdsPaymentPending({ branchId: branch?.id });
  }, { enabled: !!branch?.id });

  const items = paymentKdsRes?.data ?? [];

  const openNotification = (
    productName: string,
    positionName: string,
    areaName: string
  ) => {
    api.open({
      message: "",
      description: (
        <p className="text-[#fff] text-wrap">
          1 x {""}
          {productName} - {positionName}/{areaName} vừa gửi chế biến
        </p>
      ),
      duration: 3,
      type: "success",
      placement: "topRight",
      icon: <Image src={KdsNotifi} alt="icon" width={24} height={24} />,
      style: {
        backgroundColor: "#3355FF",
        borderRadius: "8px",
        padding: "15px",
        right: "200px",
      },
    });
  };

  const { mutate: markAsPending } = useMutation(
    (id: number) => updateKdsPending(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["KDS-PAYMENT"]);
        queryClient.invalidateQueries(["KDS"]);
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  return <>
    {contextHolder}
    <div className="card">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return <PosItemCardContainer key={item.id} isLast={isLast}>
          <PosItemCard
            item={item}
            onOK={() => {
              openNotification(
                item.product?.name!,
                item.positionName,
                item.areaName
              )
              markAsPending(item.id);
            }}
          />
        </PosItemCardContainer>
      })}
    </div>
  </>
}

export default PosServiceWaiting;
import { CustomButton } from "@/components/CustomButton";
import Image from "next/image";
import { getKdsPaymentPending, updateKdsPending } from "@/api/kds.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CaretDoubleRight from "@/assets/CaretDoubleRight.svg";
import KdsNotifi from "@/assets/kds-notifi.svg";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { message } from "antd";
import { notification } from "antd";
import { calculateCreatedTime, formatTime } from "@/utils";
import CancelIcon from "@/assets/XCircle.svg";

// CHờ thanh toán
export default function PaymentPending({ queryParams }) {
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();
  const [api, contextHolder] = notification.useNotification();

  const { data: paymentKds } = useQuery(["KDS-PAYMENT", branch?.id], () =>
    getKdsPaymentPending({
      branchId: branch?.id,
    })
  );

  notification.config({
    placement: "topRight",
    top: 50,
  });

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

  return (
    <div className="w-full h-screen">
      <div className="flex gap-10 p-3 pb-0 h-[52px]">
        <p className="text-white pl-4  text-[18px] font-semibold whitespace-nowrap">
          Chờ thanh toán
        </p>
      </div>
      {contextHolder}
      <div className="bg-white rounded-tr-[16px] p-3  min-h-[1000vh]">
        <div className="flex flex-col gap-3 ">
          {paymentKds?.data?.map((item) => (
            <div
              key={item?.id}
              className="flex justify-between gap-6 p-3 border-b border-dashed"
            >
              <div className="flex gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold ">
                    <span className="text-[#E92215] text-md font-semibold pr-2">
                      {item?.quantity} {""} x
                    </span>
                    {item?.product?.name}
                  </p>
                  <p className="text-md text-[#0094FF]">
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
                    {item?.code} - {formatTime(item?.createdAt)} -{" "}
                    {item?.creatorName}
                  </p>
                </div>
              </div>
              {!queryParams?.isBarId && (
                <div>
                  <p className="text-md font-semibold">{item?.positionName}</p>
                  <p className="text-md text-[#666666]">
                    {calculateCreatedTime(item?.updatedAt)}
                  </p>
                </div>
              )}

              {!queryParams?.isBarId && (
                <div className="flex lg:flex-row sm:flex-col gap-5">
                  <CustomButton
                    prefixIcon={<Image src={CancelIcon} />}
                    className="!bg-[#FFECEB] !p-0 !w-[100px] !h-[40px] text-[#E92215] font-semibold"
                    type="danger"
                  >
                    Từ chối
                  </CustomButton>

                  <CustomButton
                    suffixIcon={<Image src={CaretDoubleRight} />}
                    type="primary"
                    className="!w-[100px] !h-[40px] font-semibold"
                    onClick={() => {
                      openNotification(
                        item?.product?.name!,
                        item?.positionName,
                        item?.areaName
                      );
                      markAsPending(item?.id);
                    }}
                  >
                    Xong
                  </CustomButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

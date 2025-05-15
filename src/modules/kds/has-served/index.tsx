import { CustomButton } from "@/components/CustomButton";
import CaretDoubleLeft from "@/assets/CaretDoubleLeft.svg";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getKdsServedPending, updateKdsUndo } from "@/api/kds.service";
import { useRouter } from "next/router";
import { message } from "antd";
import { calculateCreatedTime, formatTime } from "@/utils";

// Đã phục vụ
export default function Has({ queryParams }) {
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const { barId } = router.query;
  const queryClient = useQueryClient();
  const { data: servingpendings } = useQuery(
    ["KDS-SERVING", branch?.id, barId],
    () =>
      getKdsServedPending({
        branchId: Number(branch?.id),
        barId: barId ? Number(barId) : undefined,
      }),
    { enabled: !!branch?.id }
  );

  const { mutate: undoMutation } = useMutation(
    (id: number) => updateKdsUndo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["KDS-ITEM"]);
        queryClient.invalidateQueries(["KDS-SERVING"]);
        message.success("Hoàn tác thành công");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  return (
    <div className="h-screen w-full">
      <div className="flex gap-10 p-3 pb-0 h-[52px]">
        <p className="text-white pl-4  text-[18px] font-semibold">Đã phục vụ</p>
      </div>
      <div className="bg-white rounded-tl-[16px] p-3 min-h-[1000vh]">
        <div className="flex flex-col gap-3 ">
          {servingpendings?.data?.map((item) => (
            <div
              key={item?.id}
              className="flex sm:flex-col  lg:flex-row justify-between p-3  gap-6 border-b border-dashed"
            >
              <div className="flex gap-3 m:flex-col  lg:flex-row">
                <CustomButton
                  prefixIcon={<Image src={CaretDoubleLeft} />}
                  className="!bg-[#FFECEB] !w-[120px] text-[#E92215] font-semibold"
                  type="danger"
                  onClick={() => undoMutation(item?.id)}
                >
                  Hoàn tác
                </CustomButton>
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
                  <p className="text-md text-[#666666] ">
                    {item?.code} - {formatTime(item?.createdAt)} -{" "}
                    {item?.creatorName}
                  </p>
                </div>
              </div>
              {!queryParams?.isBringServe && (
                <div className="">
                  <p className="text-md font-semibold whitespace-nowrap">
                    {item?.positionName}
                  </p>
                  <p className="text-md text-[#666666]">
                    {" "}
                    {calculateCreatedTime(item?.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

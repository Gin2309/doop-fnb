import React from "react";
import { message } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import {
  acceptCurrentBill,
  ArgsHandleBill,
  rejectCurrentBill,
} from "@/api/current-bill-item.service";

const BillButton = ({
  item,
  handleSeenNoti,
  refetch,
}: {
  item: any;
  handleSeenNoti?: any;
  refetch: () => void;
}) => {
  const { mutate: acceptCancelBillMutation, isLoading: isAcceptingCancelBill } =
    useMutation(
      (payload: ArgsHandleBill) =>
        acceptCurrentBill(payload),
      {
        onSuccess: async () => {
          message.success("Hủy đơn thành công");
          handleSeenNoti?.(item?.id);
          refetch();
        },
        onError(err: any) {
          message.error(
            err.response?.data?.message || "Có lỗi xảy ra vui lòng thử lại"
          );
        },
      }
    );

  const { mutate: rejectCancelBillMutation, isLoading: isRejectingCancelBill } =
    useMutation(
      (payload: ArgsHandleBill) =>
        rejectCurrentBill(payload),
      {
        onSuccess: async () => {
          message.success("Từ chối hủy đơn thành công");
          handleSeenNoti?.(item?.id);
          refetch();
        },
        onError(err: any) {
          message.error(
            err.response?.data?.message || "Có lỗi xảy ra vui lòng thử lại"
          );
        },
      }
    );
    const handleBill = (type : "reject" | "accept") =>{ 
      const billId = item?.params?.currentBillId;
      const branchId = item?.params?.branchId;
      if(!Number.isNaN(Number(billId)) && !Number.isNaN(Number(branchId))) { 
        const payload = {
          currentBillId: Number(billId),
          notificationId: item?.id,
          branchId: Number(branchId),
        }
        type === "accept" ? acceptCancelBillMutation(payload) : rejectCancelBillMutation(payload)
      }
    }

  return (
    <div className="flex gap-3 mt-2">
      <CustomButton
        outline={true}
        type="original"
        className="!h-[36px] px-5"
        disabled={isAcceptingCancelBill || isRejectingCancelBill}
        onClick={() => handleBill("reject")}
      >
        Từ chối
      </CustomButton>
      <CustomButton
        type="primary"
        className="!h-[36px] px-5"
        disabled={isAcceptingCancelBill || isRejectingCancelBill}
        onClick={() => handleBill("accept")}
      >
        Chấp nhận
      </CustomButton>
    </div>
  );
};

export default BillButton;

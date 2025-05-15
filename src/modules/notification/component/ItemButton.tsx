import React from "react";
import { message } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { useMutation } from "@tanstack/react-query";
import {
  acceptCurrentBillItem,
  ArgsAcceptCurrentBillItem,
  rejectCurrentBillItem,
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
  const { mutate: acceptCancelItemMutation, isLoading: isAcceptingCancelItem } =
    useMutation(
      (data: ArgsAcceptCurrentBillItem) =>
        acceptCurrentBillItem(data),
      {
        onSuccess: async () => {
          message.success("Hủy món thành công");
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

  const { mutate: rejectCancelItemMutation, isLoading: isRejectingCancelItem } =
    useMutation(
      (data: ArgsAcceptCurrentBillItem) =>
        rejectCurrentBillItem(data),
      {
        onSuccess: async () => {
          message.success("Từ chối hủy thành công");
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

  return (
    <div className="flex gap-3 mt-2">
      <CustomButton
        outline={true}
        type="original"
        className="!h-[36px] px-5"
        disabled={isAcceptingCancelItem || isRejectingCancelItem}
        onClick={() =>
          rejectCancelItemMutation({
            currentBillItemId: item?.params?.currentBillItemId,
            branchId: item?.params?.branchId,
            notificationId: item?.id
          })
        }
      >
        Từ chối
      </CustomButton>
      <CustomButton
        type="primary"
        className="!h-[36px] px-5"
        disabled={isAcceptingCancelItem || isRejectingCancelItem}
        onClick={() =>
          acceptCancelItemMutation({
            currentBillItemId: item?.params?.currentBillItemId,
            branchId: item?.params?.branchId,
            notificationId: item?.id
          })
        }
      >
        Chấp nhận
      </CustomButton>
    </div>
  );
};

export default BillButton;

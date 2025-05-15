import { useState } from "react";
import { message } from "antd";
import { CustomTextarea } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";
import { branchStateSession } from "@/recoil/state";
import InputError from "@/components/InputError";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useMutation } from "@tanstack/react-query";
import {
  cancelCurrentBill,
  cancelItemCurrentBill,
} from "@/api/current-bill-item.service";

type CancelType = "BILL" | "ITEM";

const ModalCancelBill = ({
  isOpen,
  onCancel,
  id,
  itemId,
  setId,
  type,
}: {
  isOpen: boolean;
  onCancel: () => void;
  id: any;
  setId?: any;
  type: CancelType;
  itemId?: any;
}) => {
  const [reason, setReason] = useState("Đổi trả lại");
  const [note, setNote] = useState("");
  const branch = useRecoilValue(branchStateSession);

  const { handleSubmit, reset } = useForm({ mode: "onChange" });

  const handleCancel = () => {
    onCancel();
    if (setId) setId(null);
    setNote("");
  };

  const mutation = useMutation(
    (data: any) =>
      type === "BILL" ? cancelCurrentBill(data) : cancelItemCurrentBill(data),
    {
      onSuccess: () => {
        message.success(
          type === "BILL"
            ? "Yêu cầu hủy đơn thành công"
            : "Yêu cầu hủy món thành công"
        );
        handleCancel();
        reset();
      },
      onError: (err: any) => {
        const errorMessage =
          err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = () => {
    if (reason === "Lý do khác" && !note) return;

    const payload: any = {
      currentBillId: id,
      branchId: branch?.id,
      note: note ? `${reason} - ${note}` : reason,
    };

    if (type === "ITEM" && itemId) {
      payload.currentBillItemId = itemId;
    }

    mutation.mutate(payload);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={handleCancel}
      title={`${type === "BILL" ? "Lý do hủy đơn" : "Lý do hủy món"}`}
      width={1000}
      onSubmit={handleSubmit(onSubmit)}
      textOk="Gửi yêu cầu hủy"
    >
      <CustomRadio
        direction="vertical"
        className="mb-2"
        value={reason}
        onChange={(e) => setReason(e)}
        options={[
          { value: "Đổi trả lại", label: "Đổi trả lại" },
          { value: "Thêm nhầm đơn hàng", label: "Thêm nhầm đơn hàng" },
          { value: "Khách báo hủy", label: "Khách báo hủy" },
          { value: "Lý do khác", label: "Lý do khác" },
        ]}
      />
      <CustomTextarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="suffix-icon h-11 !rounded"
        placeholder="Viết lý do tại đây"
      />
      {reason === "Lý do khác" && !note && (
        <InputError error="Vui lòng nhập lý do" />
      )}
    </CustomModal>
  );
};

export default ModalCancelBill;

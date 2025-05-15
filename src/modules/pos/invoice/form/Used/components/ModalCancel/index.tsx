import { createCategory } from "@/api/category.service";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { branchStateSession } from "@/recoil/state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "@/components/InputError";
import { CustomRadio } from "@/components/CustomRadio";
import { useRouter } from "next/router";
import { cancelPosition } from "@/api/area-pos.service";
import { useState } from "react";

const ModalCancelPosition = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("Đổi trả lại");
  const [note, setNote] = useState("");
  const branch = useRecoilValue(branchStateSession);

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { mutate: mutate } = useMutation(
    (data: any) => cancelPosition(router.query.id, data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        message.success("Hủy đơn thành công");
        reset();
        onCancel();
        router.back();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = () => {
    if (reason === "Lý do khác" && !note) {
      return;
    }
    const dataMutate = {
      note: `${reason} - ${note}`,
      branchId: branch?.id,
    };

    mutate(dataMutate);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Lý do hủy đơn"
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

export default ModalCancelPosition;

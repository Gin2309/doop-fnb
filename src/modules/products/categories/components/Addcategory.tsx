import { createCategory } from "@/api/category.service";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { branchStateSession } from "@/recoil/state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { schemaCreateCategory } from "../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import InputError from "@/components/InputError";

const AddCategory = ({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const branch = useRecoilValue(branchStateSession);

  const queryClient = useQueryClient();

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCreateCategory),
    mode: "onChange",
  });

  const { mutate: mutate } = useMutation((data) => createCategory(data), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["CATEGORY"]);
      message.success("Thêm mới danh mục thành công");
      reset();
      onCancel();
    },
    onError(err: any) {
      const errorMessage =
        err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    const dataMutate = {
      ...data,
      branchId: branch?.id,
    };

    mutate(dataMutate);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm danh mục"
      width={1000}
      onSubmit={handleSubmit(onSubmit)}
      textOk="Lưu"
    >
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div>
            <Label infoText="" label="Tên danh mục" required />
            <CustomInput
              {...field}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập tên danh mục"
            />
            <InputError error={errors.name?.message} />
          </div>
        )}
      />
    </CustomModal>
  );
};

export default AddCategory;

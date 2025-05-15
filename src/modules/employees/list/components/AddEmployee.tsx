import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import SortingIcon from "@/assets/column-sorting.svg";
import PlusIcon from "@/assets/plus-circle copy.svg";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaAddEmployee } from "../schema/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { createEmployee } from "@/api/employee.service";
import InputError from "@/components/InputError";
import { branchStateSession } from "@/recoil/state";
import { useRecoilState, useRecoilValue } from "recoil";
import { getRole } from "@/api/role.service";

const AddEmployee = ({
  item,
  isOpen,
  onCancel,
}: {
  item?: any;
  isOpen: boolean;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);

  const queryClient = useQueryClient();

  const { data: roles } = useQuery(
    ["ROLE", branch?.id],
    () => getRole({ limit: 99999, page: 1, branchId: item?.id || branch.id }),
    {
      enabled: !!item?.id || !!branch?.id,
    }
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaAddEmployee),
    mode: "onChange",
  });

  const { mutate: mutate } = useMutation((data) => createEmployee(data), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["EMPLOYEE"]);
      message.success("Gửi lời mời nhân viên thành công");
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
      branchId: item?.id || branch?.id,
    };

    mutate(dataMutate);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`Thêm nhân viên vào chi nhánh ${item?.name || branch?.name}`}
      width={800}
      onSubmit={handleSubmit(onSubmit)}
      textOk={t("sendInvite")}
    >
      <div className="mb-4">
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Label infoText="" label="Số điện thoại" required />
              <CustomInput
                {...field}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập số điện thoại nhân viên"
              />
              <InputError error={errors.phone?.message} />
            </div>
          )}
        />
      </div>

      <div className="mb-4">
        <Controller
          name="employeeRoleId"
          control={control}
          render={({ field }) => (
            <div>
              <Label infoText="" label="Vai trò" required />
              <CustomSelect
                {...field}
                options={roles?.data?.content?.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn vai trò"
              />
              <InputError error={errors.employeeRoleId?.message} />
            </div>
          )}
        />
      </div>

      <div className="mb-4">
        <Controller
          name="note"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Label infoText="" label="Lời nhắn" />
              <CustomInput
                {...field}
                className="suffix-icon h-11 !rounded"
                placeholder=" Nhập lời nhắn"
              />
              <InputError error={errors.note?.message} />
            </div>
          )}
        />
      </div>
    </CustomModal>
  );
};

export default AddEmployee;

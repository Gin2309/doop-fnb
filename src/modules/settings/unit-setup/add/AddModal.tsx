import Image from "next/image";
import { useTranslation } from "react-i18next";

import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaCreateUnit } from "../schema/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnit, getDetailUnit, updateUnit } from "@/api/unit.service";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import InputError from "@/components/InputError";
import { useEffect } from "react";

const AddModal = ({
  isOpen,
  onCancel,
  isLoading,
  itemSelect,
}: {
  itemSelect?: any;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const branch = useRecoilValue(branchStateSession);

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaCreateUnit),
    mode: "onChange",
  });

  const { data: unitDetail } = useQuery(
    ["UNIT_DETAIL", itemSelect, branch],
    () => getDetailUnit(Number(itemSelect), branch?.id),
    { enabled: Boolean(itemSelect && itemSelect !== null) }
  );

  useEffect(() => {
    if (unitDetail?.data) {
      reset(unitDetail?.data);
    }
  }, [unitDetail]);

  const { mutate: mutate } = useMutation(
    (data: any) => {
      return itemSelect === null
        ? createUnit(data)
        : updateUnit(itemSelect, data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["UNIT"]);
        message.success("Thêm mới thành công");
        reset();
        onCancel();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = (data) => {
    const dataMutate = {
      ...data,
      branchId: branch?.id,
    };

    mutate(dataMutate);
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={() => {
        setValue("name", "");
        onCancel();
      }}
      onSubmit={handleSubmit(onSubmit)}
      title={t("addUnit")}
      width={800}
      textOk="Lưu"
    >
      <div>
        <div className="mb-6">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <Label infoText="" label={t("unitName")} required />
                <CustomInput
                  {...field}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Nhập tên đơn vị"
                />
                <InputError error={errors.name?.message} />
              </div>
            )}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default AddModal;

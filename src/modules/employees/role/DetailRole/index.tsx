import {
  createRole,
  deleteRole,
  getPermission,
  getRoleDetail,
  updateRole,
} from "@/api/role.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import CustomPagination from "@/components/CustomPagination";
import InputError from "@/components/InputError";
import { branchStateSession } from "@/recoil/state";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Space } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

export default function DetailRole({ mode }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });
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
    mode: "onChange",
  });

  const { data: permissions } = useQuery(["PERMISSION"], () => getPermission());

  const { data: roleDetail } = useQuery(
    ["ROLE_DETAIL", router.query.id],
    () => getRoleDetail(Number(router.query.id)),
    { enabled: Boolean(router.query.id && router.query.id !== "add") }
  );

  const { mutate: mutate } = useMutation(
    (data: any) => {
      return router.query.id === "add"
        ? createRole(data)
        : updateRole(Number(router.query.id), data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["ROLE"]);
        router.back();
        message.success(
          router.query.id === "add"
            ? "Thêm mới vai trò nhân viên thành công"
            : "Cập nhật vai trò nhân viên thành công"
        );
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleCheckboxChange = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, id]);
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((permission) => permission !== id)
      );
    }
  };

  const onSubmit = (data) => {
    const dataMutate = {
      ...data,
      permissions: selectedPermissions,
      branchId: branch?.id,
    };

    mutate(dataMutate);
  };

  useEffect(() => {
    if (roleDetail?.data) {
      reset(roleDetail?.data);
      const permissionIds = roleDetail.data.permissions.map(
        (perm) => perm.permission.id
      );
      setSelectedPermissions(permissionIds);
    }
  }, [roleDetail]);

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteRole(Number(router.query.id));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["ROLE"]);
        router.back();
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleDelete = () => {
    mutateDelete();
  };

  return (
    <>
      <div className="flex justify-between bg-white p-4 shadow-md mb-5">
        <p className="text-2xl font-semibold">
          {router.query.id === "add" ? t("addNewRole") : roleDetail?.data?.name}
        </p>
        <Space>
          <CustomButton
            type="original"
            wrapClassName="w-[100px]"
            onClick={() => router.back()}
          >
            Hủy
          </CustomButton>
          {router.query.id !== "add" && (
            <CustomButton
              type="danger"
              wrapClassName="w-[100px]"
              className="!bg-white text-red-500 border-red-500"
              onClick={() =>
                setShowDeleteNoti({
                  visible: true,
                  content: `Xóa ${roleDetail?.data?.name}`,
                })
              }
            >
              Xóa
            </CustomButton>
          )}
          <CustomButton
            type="primary"
            wrapClassName="w-[100px]"
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </CustomButton>
        </Space>
      </div>
      <CustomCardItem className="mx-4">
        <div className="p-5 mt-5 mb-20">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: "Tên vai trò là bắt buộc", // Add validation rule
            }}
            render={({ field }) => (
              <div>
                <Label infoText="" label="Tên vai trò" required />
                <CustomInput
                  {...field}
                  placeholder="Tên vai trò"
                  className="w-[100%] h-11 flex-1"
                />
                <InputError error={errors.name?.message} />
              </div>
            )}
          />

          {permissions?.data?.map((item, key) => (
            <div key={key}>
              <div className="p-2 bg-[#F9FAFD]  font-semibold my-10">
                {item.title}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {item?.child?.map((item, index) => (
                  <CustomCheckbox
                    checked={selectedPermissions.includes(item.id)}
                    key={index}
                    onChange={(e) =>
                      handleCheckboxChange(e.target.checked, item.id)
                    }
                  >
                    {item.name}
                  </CustomCheckbox>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CustomCardItem>

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={handleDelete}
        />
      )}
    </>
  );
}

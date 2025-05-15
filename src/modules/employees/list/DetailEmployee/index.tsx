import {
  createEmployee,
  deleteEmployee,
  getDetailEmployee,
  updateEmployee,
} from "@/api/employee.service";
import {
  createRole,
  getPermission,
  getRole,
  getRoleDetail,
  updateRole,
} from "@/api/role.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import CustomPagination from "@/components/CustomPagination";
import InputError from "@/components/InputError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Space } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { schemaUpdateEmployee } from "../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomSelect } from "@/components/CustomSelect";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { branchStateSession } from "@/recoil/state";

export default function DetailEmployee({ mode }) {
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const router = useRouter();
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const queryClient = useQueryClient();

  const { data: roles } = useQuery(["ROLE"], () =>
    getRole({ limit: 99999, page: 1, branchId: branch?.id })
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaUpdateEmployee),
    mode: "onChange",
  });

  const { data: employeeDetail } = useQuery(
    ["EMPLOYEE_DETAIL", router.query.id],
    () => getDetailEmployee(Number(router.query.id)),
    { enabled: Boolean(router.query.id && router.query.id !== "add") }
  );

  const { mutate: mutate } = useMutation(
    (data: any) => {
      return router.query.id === "add"
        ? createEmployee(data)
        : updateEmployee(Number(router.query.id), data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["EMPLOYEE"]);
        router.back();
        message.success(
          router.query.id === "add"
            ? "Gửi lời mời nhân viên thành công"
            : "Cập nhật nhân viên thành công"
        );
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteEmployee(Number(router.query.id));
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["EMPLOYEE"]);
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

  const onSubmit = (data) => {
    mutate(data);
  };

  const handleDelete = () => {
    mutateDelete();
  };

  useEffect(() => {
    if (employeeDetail?.data) {
      setValue("employeeRoleId", employeeDetail?.data?.employeeRole?.id);
      setValue("status", employeeDetail?.data?.status);
    }
  }, [employeeDetail]);

  return (
    <>
      <div>
        <div className="flex justify-between bg-white p-4 shadow-md mb-5">
          <p className="text-2xl font-semibold">
            {router.query.id === "add"
              ? t("addNewBranch")
              : employeeDetail?.data?.user?.name}
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
                    content: `Xóa ${employeeDetail?.data?.user?.name}`,
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
          <div className="p-[15px] grid grid-cols-2  gap-5">
            <div>
              <Label infoText="" label="Mã nhân viên" />
              <CustomInput
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Mã nhân viên"
                value={employeeDetail?.data?.code}
                className="w-[100%] h-11 flex-1"
                disabled
              />
            </div>

            <div>
              <Label infoText="" label="Họ tên nhân viên" />
              <CustomInput
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Họ tên nhân viên"
                value={employeeDetail?.data?.user?.name}
                className="w-[100%] h-11 flex-1"
                disabled
              />
            </div>

            <div>
              <Label infoText="" label="Email" />
              <CustomInput
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Họ tên nhân viên"
                value={employeeDetail?.data?.user?.email}
                className="w-[100%] h-11 flex-1"
                disabled
              />
            </div>

            <div>
              <Label infoText="" label="Số điện thoại" />
              <CustomInput
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Số điện thoại"
                value={employeeDetail?.data?.phone}
                className="w-[100%] h-11 flex-1"
                disabled
              />
            </div>

            <div>
              <Label infoText="" label="Ngày sinh" />
              <CustomInput
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder="Ngày sinh"
                value={employeeDetail?.data?.user?.dob}
                className="w-[100%] h-11 flex-1"
                disabled
              />
            </div>

            <div>
              <Label infoText="" label="Giới tính" />

              <CustomSelect
                value={employeeDetail?.data?.user?.sex}
                options={[
                  {
                    value: "FEMALE",
                    label: "Nữ",
                  },
                  {
                    value: "MALE",
                    label: "Nam",
                  },
                ]}
                disabled
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn vai trò"
              />
            </div>

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

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div>
                  <Label infoText="" label="Trạng thái" required />
                  <CustomSelect
                    {...field}
                    options={[
                      {
                        label: "Đang hoạt động",
                        value: "ACTIVE",
                      },
                      // {
                      //   label: "Đang chờ",
                      //   value: "PENDING",
                      // },
                      {
                        label: "Không hoạt động",
                        value: "INACTIVE",
                      },
                      {
                        label: "Đã nghỉ việc",
                        value: "RESIGNED",
                      },
                    ]}
                    showSearch={true}
                    className="suffix-icon h-11 !rounded"
                    placeholder="Chọn trạng thái"
                  />
                  <InputError error={errors.status?.message} />
                </div>
              )}
            />
          </div>
        </CustomCardItem>
      </div>
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

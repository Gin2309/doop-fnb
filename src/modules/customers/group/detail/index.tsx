import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Skeleton, message } from "antd";

import AddModal from "./AddModal";
import { ColumnType } from "antd/es/table";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import CustomActionHeader from "@/components/CustomActionHeader";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomTable from "@/components/CustomTable";
import { CustomTextarea } from "@/components/CustomInput";
import CustomPagination from "@/components/CustomPagination";
import AddModal2 from "./AddCustomer/AddModal2";
import Search from "../Search";

import PlusIcon from "@/assets/plusOrangeIcon.svg";
import Close from "@/assets/X.svg";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import schema from "../schema";
import {
  getDetailCustomerGroup,
  deleteCustomerGroup,
  updateGroup,
  removeFromGroup,
} from "@/api/customer-group.service";
import { getListByGroup } from "@/api/customer.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const DetailCustomerGroup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const branchChainId = Number(branch?.branchChain?.id);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [customerIds, setCustomerIds] = useState([]);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId: branchId,
    groupCustomerId: id,
  });

  const { data, isLoading, refetch } = useQuery(["DETAIL"], () =>
    getDetailCustomerGroup(branchId, id)
  );
  const groupDetail = data?.data;

  const {
    getValues,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: groupDetail?.name || "",
      isBranchChainLink: groupDetail?.isBranchChainLink || false,
      description: groupDetail?.description || "",
      hourDiscount: groupDetail?.hourDiscount || null,
      foodDiscount: groupDetail?.foodDiscount || null,
      otherDiscount: groupDetail?.otherDiscount || null,
    },
  });

  useEffect(() => {
    if (groupDetail) {
      reset({
        name: groupDetail?.name || "",
        isBranchChainLink: groupDetail?.isBranchChainLink || false,
        description: groupDetail?.description || "",
        hourDiscount: groupDetail?.hourDiscount || null,
        foodDiscount: groupDetail?.foodDiscount || null,
        otherDiscount: groupDetail?.otherDiscount || null,
      });
    }
  }, [groupDetail, reset]);

  const { mutate: updateGroupMutation, isLoading: isUpdating } = useMutation(
    (data: any) => updateGroup(data, id),
    {
      onSuccess: () => {
        message.success("Cập nhật thông tin thành công!");
        router.push("/customers/group");
        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    const data = getValues();

    const submittedData = {
      ...data,
      branchId,
      ...(data.isBranchChainLink ? { branchChainId } : {}),
    };

    updateGroupMutation(submittedData);
  };

  const { mutate: deleteGroupMutation, isLoading: isDeleting } = useMutation(
    () => deleteCustomerGroup(branchId, id),
    {
      onSuccess: () => {
        message.success("Xóa nhóm khách hàng thành công!");
        router.push("/customers/group");
        setShowDeleteNoti({
          visible: false,
          content: "",
        });
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onDelete = () => {
    deleteGroupMutation();
  };

  const {
    data: group,
    isLoading: isListing,
    refetch: groupRefetch,
  } = useQuery(["CUSTOMER_BY_GROUP", formFilter], () =>
    getListByGroup(formFilter)
  );

  useEffect(() => {
    if (group && group.data && group.data.content) {
      const ids = group.data.content.map((item) => item.id);
      setCustomerIds(ids);
    }
  }, [group]);

  const { mutate: removeMutation, isLoading: isRemoving } = useMutation(
    (data: any) => removeFromGroup(data, id),
    {
      onSuccess() {
        groupRefetch();
        message.success("Gỡ khách hàng khỏi nhóm thành công!");
      },
      onError(err: any) {
        console.log(err.response?.data?.message);
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleRemove = (customerId: number) => {
    const data = {
      branchId,
      customerId,
    };
    removeMutation(data);
  };

  const columns: ColumnType<any>[] = [
    {
      dataIndex: "index",
      width: 60,
      render: (_, __, index: number) => (
        <span className="text-[#333333] font-semibold">{index + 1}</span>
      ),
      align: "center",
    },
    {
      dataIndex: "code",
      width: 100,
      align: "center",
      render: (value: number) => (
        <span className="cursor-pointer text-[#1890ff]">{value || "-"}</span>
      ),
    },
    {
      dataIndex: "name",
      render: (value: string) => <span>{value}</span>,
    },
    {
      dataIndex: "phone",
      align: "center",
      render: (value: number) => <span>{value}</span>,
    },
    {
      align: "right",
      render: (record) => (
        <div onClick={() => handleRemove(record?.id)}>
          <Image src={Close} alt="Close Icon" width={24} height={24} />
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomActionHeader
        title={groupDetail?.name}
        type="delete"
        onDelete={() =>
          setShowDeleteNoti({
            visible: true,
            content: `Xóa ${groupDetail.name}`,
          })
        }
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isUpdating}
      />

      {isLoading ? (
        <Skeleton active />
      ) : (
        <div>
          <div className="card mb-6">
            <div className="my-6 flex flex-col 2xs:gap-4 md:gap-6">
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label
                      infoText=""
                      label={t("customerGroupName")}
                      required
                    />
                    <CustomInput
                      className={`suffix-icon h-11 !rounded`}
                      placeholder="Tên nhóm khách hàng"
                      onChange={onChange}
                      value={value}
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />

              <div className="grid xs:grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  name="hourDiscount"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <div>
                        <Label infoText="" label={t("hourlyDiscount")} />
                        <CustomInput
                          onChange={onChange}
                          value={value ?? ""}
                          type="number"
                          className="suffix-icon h-11 !rounded"
                          placeholder="Nhập chiết khấu"
                        />
                        <InputError error={errors.hourDiscount?.message} />
                      </div>
                    );
                  }}
                />

                <Controller
                  name="foodDiscount"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <div>
                        <Label infoText="" label={t("foodDiscount")} />
                        <CustomInput
                          onChange={onChange}
                          value={value ?? ""}
                          type="number"
                          className="suffix-icon h-11 !rounded"
                          placeholder="Nhập chiết khấu"
                        />
                        <InputError error={errors.foodDiscount?.message} />
                      </div>
                    );
                  }}
                />

                <Controller
                  name="otherDiscount"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <div>
                        <Label infoText="" label={t("ortherDiscount")} />
                        <CustomInput
                          onChange={onChange}
                          value={value ?? ""}
                          type="number"
                          className="suffix-icon h-11 !rounded"
                          placeholder="Nhập chiết khấu"
                        />
                        <InputError error={errors.otherDiscount?.message} />
                      </div>
                    );
                  }}
                />
              </div>

              <Controller
                name="isBranchChainLink"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="col-span-1 md:col-span-2 flex gap-2 items-center">
                    <CustomCheckbox
                      checked={value ?? false}
                      onChange={onChange}
                    />
                    <div className="font-semibold text-[#1a1a1a]">
                      Liên kết chuỗi (Áp dụng chiết khấu và cho phép truy cập
                      danh sách khách hàng trên toàn chuỗi chi nhánh)
                    </div>
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="md:col-span-2">
                    <Label infoText="" label={t("description")} />
                    <CustomTextarea
                      placeholder="Viết mô tả"
                      onChange={onChange}
                      value={value ?? ""}
                      autoSize={{ minRows: 1, maxRows: 6 }}
                    />
                    <InputError error={errors.description?.message} />
                  </div>
                )}
              />
            </div>

            <div className="md:col-span-2 col-span-1">
              <Label infoText="" label={t("customerGroupList")} />

              <Search
                setFormFilter={setFormFilter}
                onClick={() => setOpen(true)}
              />

              {group?.data?.content?.length > 0 && (
                <CustomTable
                  showHeader={false}
                  dataSource={group?.data?.content}
                  columns={columns}
                  loading={isListing}
                  scroll={{ x: 700 }}
                  rowClassName="hover-row"
                />
              )}

              <div className="flex flex-start mt-1">
                <CustomButton
                  type="outline"
                  className="!rounded-[50px]"
                  prefixIcon={<Image src={PlusIcon} />}
                  onClick={() => setOpen2(true)}
                >
                  {t("addCustomer")}
                </CustomButton>
              </div>

              {group?.data?.content?.length > 0 && (
                <CustomPagination
                  page={formFilter.page}
                  pageSize={formFilter.limit}
                  total={data?.data?.totalElements}
                  setPage={(value) =>
                    setFormFilter({ ...formFilter, page: value })
                  }
                  setPerPage={(value) =>
                    setFormFilter({ ...formFilter, limit: value })
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}

      <AddModal
        isOpen={open}
        id={groupDetail?.id}
        branchId={branchId}
        onCancel={() => setOpen(false)}
        refetch={groupRefetch}
        allId={customerIds}
      />

      <AddModal2
        isOpen={open2}
        id={groupDetail?.id}
        branchId={branchId}
        onCancel={() => setOpen2(false)}
        refetch={groupRefetch}
      />

      {showDeleteNoti && (
        <CustomNotiAction
          isVisible={showDeleteNoti.visible}
          setIsVisible={setShowDeleteNoti}
          title="Bạn có chắc chắn muốn xóa?"
          content={showDeleteNoti.content}
          type="warn"
          onSubmit={onDelete}
        />
      )}
    </>
  );
};

export default DetailCustomerGroup;

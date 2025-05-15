import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import AddModal from "./AddModal";

import Label from "@/components/CustomLabel";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import CustomActionHeader from "@/components/CustomActionHeader";
import CustomTable from "@/components/CustomTable";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { ColumnType } from "antd/es/table";
import { CustomTextarea } from "@/components/CustomInput";
import Search from "./Search";
import AddModal2 from "./AddCustomer/AddModal2";

import PlusIcon from "@/assets/plusOrangeIcon.svg";
import Close from "@/assets/X.svg";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import schema from "../schema";
import { createCustomerGroup } from "@/api/customer-group.service";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const AddCustomerGroup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const branchChainId = Number(branch?.branchChain?.id);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [customer, setCustomer] = useState<any>([]);
  const userIds = customer.length > 0 ? customer.map((item) => item.id) : [];
  const [filteredCustomer, setFilteredCustomer] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    getValues,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { mutate: createGroupMutation, isLoading } = useMutation(
    (data: any) => createCustomerGroup(data),
    {
      onSuccess: () => {
        message.success("Thêm nhóm khách hàng thành công!");
        router.push("/customers/group");
        setCustomer([]);
        reset();
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
      customerIds: userIds,
      ...(data.isBranchChainLink ? { branchChainId } : {}),
    };

    createGroupMutation(submittedData);
  };

  const handleUserSelection = (users) => {
    setCustomer((prevSelectedUsers) => [...prevSelectedUsers, ...users]);
  };

  const handleDeleteCustomer = (id) => {
    setCustomer(customer.filter((item) => item.id !== id));
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
      render: (_, record) => (
        <div onClick={() => handleDeleteCustomer(record.id)}>
          <Image src={Close} alt="Delete" />
        </div>
      ),
    },
  ];
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  useEffect(() => {
    if (!searchKeyword) {
      setFilteredCustomer(customer);
    } else {
      const result = customer.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredCustomer(result);
    }
  }, [searchKeyword, customer]);

  return (
    <>
      <CustomActionHeader
        title="addCustomerGroup"
        type="save"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
      />

      <div>
        <div className="card mb-6">
          <div className="my-6 flex flex-col 2xs:gap-4 md:gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Label infoText="" label={t("customerGroupName")} required />
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
                <div className="flex gap-2 items-center">
                  <CustomCheckbox
                    checked={value ?? false}
                    onChange={onChange}
                  />
                  <div className="font-semibold text-[#1a1a1a]">
                    Liên kết chuỗi (Áp dụng chiết khấu và cho phép truy cập danh
                    sách khách hàng trên toàn chuỗi chi nhánh)
                  </div>
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div>
                  <Label infoText="" label={t("description")} />
                  <CustomTextarea
                    className={`suffix-icon h-11 !rounded`}
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

          <div>
            <Label infoText="" label={t("customerGroupList")} />
            <Search onSearch={handleSearch} onClick={() => setOpen(true)} />
            {!customer || customer?.length === 0 ? null : (
              <CustomTable
                showHeader={false}
                dataSource={filteredCustomer}
                columns={columns}
                scroll={{ x: 700 }}
                rowClassName={() => "hover-row"}
              />
            )}
          </div>
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
        </div>
      </div>

      <AddModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
        branchId={branchId}
        onUserSelection={handleUserSelection}
        userIds={userIds}
      />

      <AddModal2
        isOpen={open2}
        branchId={branchId}
        onUserSelection={handleUserSelection}
        onCancel={() => setOpen2(false)}
      />
    </>
  );
};

export default AddCustomerGroup;

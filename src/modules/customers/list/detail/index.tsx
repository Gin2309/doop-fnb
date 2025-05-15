import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { message, Skeleton } from "antd";
import { useRouter } from "next/router";

import { ColumnsType } from "antd/es/table";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomInput } from "@/components/CustomInput";
import CustomTag from "@/components/CustomTag";
import CustomTable from "@/components/CustomTable";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomButton } from "@/components/CustomButton";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { formatMoney } from "@/helpers";
import NotFound from "@/assets/images/InvoicesNotFound.png";
import CustomActionHeader from "@/components/CustomActionHeader";

import arrow from "@/assets/greenArrowUp.svg";
import pencil from "@/assets/PencilSimple.svg";
import up from "@/assets/CaretUp.svg";

import { useRecoilValue } from "recoil";
import { branchStateSession, provinceState } from "@/recoil/state";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import schema from "./schema";
import {
  getDistrict,
  getDetailCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/api/customer.service";

interface InvoicesRecord {
  key: number;
  date: string;
  referenceCode: string;
  cashier: string;
  type: string;
  orderNameOrArea: string;
  paymentMethod: string;
  totalAmount: number;
  orderStatus: string;
}

interface PointsRecord {
  key: number;
  time: string;
  referenceCode: string;
  type: string;
  totalAmount: number;
  orderStatus: string;
  transactionPoints: number;
  pointsAfterTransaction: number;
}

const genderGroup = {
  data: {
    items: [
      { id: "MALE", name: "Nam" },
      { id: "FEMALE", name: "Nữ" },
    ],
  },
};

const getTagColor = {
  success: "success",
  pending: "processing",
  canceled: "error",
  refunded: "warning",
  credit: "volcano",
  default: "default",
};

const DetailCustomer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const province = useRecoilValue(provinceState);
  const [showDeleteNoti, setShowDeleteNoti] = useState({
    visible: false,
    content: "",
  });

  const { data, isLoading, refetch } = useQuery(["DETAIL"], () =>
    getDetailCustomer(branchId, id)
  );
  const useDetail = data?.data;

  const {
    getValues,
    setValue,
    watch,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: useDetail?.name || "",
      phone: useDetail?.phone || "",
      email: useDetail?.email || "",
      dob: useDetail?.dob || null,
      gender: useDetail?.gender || null,
      provinceCode: useDetail?.provinceCode || null,
      districtCode: useDetail?.districtCode || null,
      address: useDetail?.address || null,
      note: useDetail?.note || null,
      isVatBill: useDetail?.isVatBill || false,
      isAutoVatBill: useDetail?.isAutoVatBill || false,
      vatTaxCode: useDetail?.vatTaxCode || null,
      vatEmail: useDetail?.vatEmail || null,
      vatPhone: useDetail?.vatPhone || "",
      vatName: useDetail?.vatName || null,
      vatNote: useDetail?.vatNote || null,
      vatAddress: useDetail?.vatAddress || null,
      vatCompany: useDetail?.vatCompany || null,
      code: useDetail?.code || "",
    },
  });

  useEffect(() => {
    if (useDetail) {
      reset({
        name: useDetail?.name || "",
        phone: useDetail?.phone || "",
        email: useDetail?.email || "",
        dob: useDetail?.dob || null,
        gender: useDetail?.gender || null,
        provinceCode: useDetail?.provinceCode || null,
        districtCode: useDetail?.districtCode || null,
        address: useDetail?.address || null,
        note: useDetail?.note || null,
        isVatBill: useDetail?.isVatBill || false,
        isAutoVatBill: useDetail?.isAutoVatBill || false,
        vatTaxCode: useDetail?.vatTaxCode || null,
        vatEmail: useDetail?.vatEmail || null,
        vatPhone: useDetail?.vatPhone || "",
        vatName: useDetail?.vatName || null,
        vatNote: useDetail?.vatNote || null,
        vatAddress: useDetail?.vatAddress || null,
        vatCompany: useDetail?.vatCompany || null,
        code: useDetail?.code || "",
      });
    }
  }, [useDetail, reset]);

  const [isChecked, setIsChecked] = useState(getValues("isVatBill") ?? false);

  const handleCheckboxChange = (value) => {
    setIsChecked(value.target.checked);
  };

  useEffect(() => {
    if (!isChecked) {
      reset({
        isAutoVatBill: false,
        vatTaxCode: "",
        vatEmail: "",
        vatPhone: "",
        vatName: "",
        vatNote: "",
        vatAddress: "",
        vatCompany: "",
      });
    }
  }, [isChecked, setValue]);

  const { mutate: updateCustomerMutation, isLoading: isUpdating } = useMutation(
    (data: any) => updateCustomer(data, id),
    {
      onSuccess: () => {
        message.success("Cập nhật thông tin thành công!");
        router.push("/customers/list");
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
    };

    updateCustomerMutation(submittedData);
  };

  const { mutate: deleteCustomerMutation, isLoading: isDeleting } = useMutation(
    () => deleteCustomer(branchId, id),
    {
      onSuccess: () => {
        message.success("Xóa khách hàng thành công!");
        router.push("/customers/list");
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
    deleteCustomerMutation();
  };

  const provinceCode = watch("provinceCode");

  const { data: district } = useQuery(["DISTRICT", provinceCode], () =>
    getDistrict(provinceCode)
  );

  const dataSource = [
    {
      key: 1,
      date: "16/08/2024 20:52",
      referenceCode: "846900156894",
      cashier: "Kim Chi",
      type: "dineIn",
      paymentMethod: "Chuyển khoản",
      orderNameOrArea: "N0056",
      totalAmount: 100000,
      orderStatus: "success",
    },
    {
      key: 2,
      date: "15/08/2024 16:52",
      referenceCode: "846900157794",
      cashier: "Thu Hường",
      type: "dineIn",
      paymentMethod: "Tiền mặt",
      orderNameOrArea: "N0056",
      totalAmount: 70000,
      orderStatus: "success",
    },
  ];

  const columns: ColumnsType<InvoicesRecord> = [
    {
      title: t("paymentTime"),
      dataIndex: "date",
      key: "date",
    },
    {
      title: t("referenceCode"),
      dataIndex: "referenceCode",
      key: "referenceCode",
      render: (text: string, record: InvoicesRecord) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          // onClick={() => handleRowClick(record)}
        >
          {text}
        </button>
      ),
      align: "center",
    },
    {
      title: t("cashier"),
      dataIndex: "cashier",
      align: "center",
      key: "cashier",
    },
    {
      title: t("totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (value: number) => formatMoney(value),
    },
    {
      title: t("paymentMethod"),
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (value: string) => {
        if (value === "Chuyển khoản") {
          return t("bankTransfer");
        } else if (value === "Tiền mặt") {
          return t("cash");
        } else if (value === "Quẹt thẻ") {
          return t("creditCard");
        }
        return value;
      },
    },
    {
      title: t("status"),
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (value: string) => {
        return (
          <CustomTag
            title={t(value)}
            color={getTagColor[value] || getTagColor.default}
          />
        );
      },
    },
  ];

  const pointColumns: ColumnsType<PointsRecord> = [
    {
      title: t("time"),
      dataIndex: "date",
      key: "date",
    },
    {
      title: t("referenceCode"),
      dataIndex: "referenceCode",
      key: "referenceCode",
      render: (text: string, record: PointsRecord) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          // onClick={() => handleRowClick(record)}
        >
          {text}
        </button>
      ),
    },
    {
      title: t("type"),
      dataIndex: "type",
      key: "type",
      render: (value: string) => {
        return t(value);
      },
    },
    {
      title: t("value"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value: number) => formatMoney(value),
    },
    {
      title: t("transactionPoints"),
      dataIndex: "transactionPoints",
      key: "transactionPoints",
      align: "center",
    },
    {
      title: t("pointsAfterTransaction"),
      dataIndex: "pointsAfterTransaction",
      key: "pointsAfterTransaction",
      align: "center",
    },
  ];

  const pointData = [
    {
      key: 12,
      date: "16/08/2024 20:52",
      referenceCode: "846900156894",
      type: "dineIn",
      totalAmount: 100000,
      transactionPoints: 2,
      pointsAfterTransaction: 10,
    },
    {
      key: 42,
      date: "15/08/2024 16:52",
      referenceCode: "846900157794",
      type: "takeaway",
      totalAmount: 70000,
      transactionPoints: -3,
      pointsAfterTransaction: 0,
    },
  ];

  const locale = {
    emptyText: (
      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <Image src={NotFound} alt="No Data" />
        <p
          style={{
            color: "#333333",
            fontWeight: 600,
            marginTop: "20px",
            fontSize: 20,
          }}
        >
          {t("notFoundInvoices")}
        </p>
      </div>
    ),
  };

  return (
    <>
      <CustomActionHeader
        title={useDetail?.name}
        type="delete"
        onSubmit={handleSubmit(onSubmit)}
        onDelete={() =>
          setShowDeleteNoti({
            visible: true,
            content: `Xóa ${useDetail.name}`,
          })
        }
        isLoading={isLoading || isUpdating}
      />

      <div className="2xs:gap-4 md:gap-6 flex flex-col mb-[100px]">
        <div className="card">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] mb-6">
            {t("customerInformation")}
          </h1>
          {isLoading ? (
            <Skeleton active />
          ) : (
            <div className="my-6 grid 2xs:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
              <Controller
                name="code"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("customerCode")} />
                    <CustomInput
                      disabled
                      className={`suffix-icon h-11 !rounded`}
                      placeholder="Mã khách hàng tự động"
                      onChange={onChange}
                      value={value ?? ""}
                    />
                    <InputError error={errors.code?.message} />
                  </div>
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("customerFullName")} required />
                    <CustomInput
                      className={`suffix-icon h-11 !rounded`}
                      placeholder="Nhập họ và tên khách hàng"
                      onChange={onChange}
                      value={value}
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("email")} />
                    <CustomInput
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập email của nhân viên"
                      onChange={onChange}
                      value={value ?? ""}
                    />
                    <InputError error={errors.email?.message} />
                  </div>
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("phoneNumber")} required />
                    <CustomInput
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập số điện thoại khách hàng"
                      onChange={onChange}
                      value={value}
                    />
                    <InputError error={errors.phone?.message} />
                  </div>
                )}
              />

              <Controller
                name="dob"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div>
                      <Label infoText="" label={t("dateOfBirth")} />
                      <CustomDatePicker
                        onChange={onChange}
                        bordered={true}
                        picker="date"
                        value={value ?? null}
                      />
                      <InputError error={errors.dob?.message} />
                    </div>
                  );
                }}
              />

              <Controller
                name="gender"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div>
                      <Label infoText="" label={t("gender")} />
                      <CustomSelect
                        options={genderGroup?.data?.items?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        showSearch={true}
                        onChange={onChange}
                        value={value}
                        className="suffix-icon h-11 !rounded"
                        placeholder="Chọn giới tính"
                      />
                      <InputError error={errors.gender?.message} />
                    </div>
                  );
                }}
              />

              <div className="col-span-2 border-[1px] border-[#E5E5E5]"></div>

              <Controller
                name="provinceCode"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div>
                      <Label infoText="" label={t("provinceOrCity")} />
                      <CustomSelect
                        options={province?.map((item: any) => ({
                          value: item.code,
                          label: item.name,
                        }))}
                        onChange={onChange}
                        value={value}
                        showSearch
                        className="suffix-icon h-11 !rounded"
                        placeholder="Chọn tỉnh/thành phố"
                      />
                      <InputError error={errors.provinceCode?.message} />
                    </div>
                  );
                }}
              />

              <Controller
                name="districtCode"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div>
                      <Label infoText="" label={t("districtOrTown")} />
                      <CustomSelect
                        options={
                          district?.data?.length > 0
                            ? district?.data?.map((item: any) => ({
                                value: item.code,
                                label: item.name,
                              }))
                            : [
                                {
                                  value: "",
                                  label: "Vui lòng chọn Tỉnh/Thành phố",
                                  disabled: true,
                                },
                              ]
                        }
                        onChange={onChange}
                        showSearch
                        value={value}
                        className="suffix-icon h-11 !rounded"
                        placeholder="Chọn quận/huyện"
                      />
                      <InputError error={errors.districtCode?.message} />
                    </div>
                  );
                }}
              />

              <Controller
                name="address"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("specificAddress")} />
                    <CustomInput
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập địa chỉ cụ thể"
                      onChange={onChange}
                      value={value ?? ""}
                    />
                    <InputError error={errors.address?.message} />
                  </div>
                )}
              />

              <Controller
                name="note"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <Label infoText="" label={t("note")} />
                    <CustomInput
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập ghi chú"
                      onChange={onChange}
                      value={value ?? ""}
                    />
                    <InputError error={errors.note?.message} />
                  </div>
                )}
              />
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between mb-4 items-center">
            <h1 className="text-[#1a1a1a] font-semibold text-[20px]">
              {t("currentPoint")}:{" "}
              <span className="text-[#3355FF] font-semibold text-[20px]">
                16
              </span>
            </h1>

            <div className="flex gap-3">
              <CustomButton
                type="download-btn"
                prefixIcon={<Image src={arrow} />}
              >
                {t("rechargePoint")}
              </CustomButton>
              <CustomButton
                type="print-btn"
                prefixIcon={<Image src={pencil} />}
              >
                {t("editPoint")}
              </CustomButton>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <h1 className="text-[#1a1a1a] font-semibold text-[20px]">
              {t("pointsHistory")}
            </h1>
            <Image src={up} alt="icon" />
          </div>

          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            // locale={locale}
            dataSource={pointData}
            columns={pointColumns}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record),
            // })}
            rowClassName={() => "hover-row"}
          />
        </div>

        <div className="card">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] mb-6">
            {t("vatInvoiceInfo")}
          </h1>

          {isLoading ? (
            <Skeleton active />
          ) : (
            <div className="gap-4 grid 2xs:grid-cols-1 md:grid-cols-2">
              <Controller
                name="isVatBill"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="2xs:col-span-1 md:col-span-2">
                    <CustomCheckbox
                      checked={value ?? false}
                      onChange={(e) => {
                        onChange(e);
                        handleCheckboxChange(e);
                      }}
                    />
                    <span className="ml-2">{t("vatInvoice")}</span>
                  </div>
                )}
              />

              {isChecked && (
                <>
                  <Controller
                    name="isAutoVatBill"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="2xs:col-span-1 md:col-span-2">
                        <CustomCheckbox
                          checked={value ?? false}
                          onChange={onChange}
                        />
                        <span className="ml-2">{t("autoVatRequest")}</span>
                      </div>
                    )}
                  />

                  <Controller
                    name="vatTaxCode"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("taxCode")} required />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập mã mã số thuế"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatTaxCode?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatCompany"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("vatCompany")} required />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập tên công ty/đơn vị"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatCompany?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatAddress"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("address")} required />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập địa chỉ cụ thể"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatAddress?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatNote"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("note")} />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập ghi chú"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatNote?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatEmail"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="2xs:col-span-1 md:col-span-2">
                        <Label
                          infoText=""
                          label={t("vatInvoiceEmail")}
                          required
                        />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập email"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatEmail?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatPhone"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("phoneNumber")} />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập số điện thoại"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatPhone?.message} />
                      </div>
                    )}
                  />

                  <Controller
                    name="vatName"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div>
                        <Label infoText="" label={t("buyerName")} />
                        <CustomInput
                          className={`suffix-icon h-11 !rounded`}
                          placeholder="Nhập họ tên khách hàng"
                          onChange={onChange}
                          value={value ?? ""}
                        />
                        <InputError error={errors.vatName?.message} />
                      </div>
                    )}
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between mb-6">
            <h1 className="text-[#1a1a1a] font-semibold text-[20px]">
              {t("recentInvoices")}
            </h1>
            <Image src={up} alt="icon" />
          </div>

          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            locale={locale}
            dataSource={dataSource}
            columns={columns}
            // onRow={(record) => ({
            //   onClick: () => handleRowClick(record),
            // })}
            rowClassName={() => "hover-row"}
          />
        </div>
      </div>

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

export default DetailCustomer;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { formatNumber } from "@/helpers";
import { formatMoney } from "@/helpers";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { CustomInput } from "@/components/CustomInput";
import CloseIcon from "@/assets/CloseIcon2.svg";
import DeleIcon from "@/assets/deleteRed.svg";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteVariantPosition } from "@/api/config-position.service";
import { message } from "antd";

interface Record {
  key: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
}

const TableVariant = ({
  dataSource,
  onQuantityChange,
  handleDeleteRow,
}: {
  dataSource: any;
  onQuantityChange: (quantities: { [key: number]: number }) => void;
  handleDeleteRow?: (id: number) => void;
}) => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const branchId = branch?.id;
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const handleQuantityChange = (value: any, id: number) => {
    onQuantityChange({ [id]: value });
  };

  const mutation = useMutation({
    mutationFn: (ids: number[] | any) => deleteVariantPosition(ids, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries(["POS"]);
      message.success("Xóa thành công!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
      message.error(errorMessage);
    },
  });

  const handleDelete = () => {
    mutation.mutate(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const deleteSingle = async (id: number) => {
    await mutation.mutateAsync([id]);
    if (handleDeleteRow) handleDeleteRow(id);
  };

  const columns: ColumnsType<Record> = [
    {
      title: (
        <div className="flex items-center justify-center mr-5">
          {selectedRowKeys?.length > 0 && (
            <div
              className=" absolute left-2 bottom-2 cursor-pointer"
              onClick={handleDelete}
            >
              <Image src={DeleIcon} />
            </div>
          )}
          {t("index")}
        </div>
      ),
      key: "index",
      align: "center",
      width: "150px",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t("itemName"),
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_: any, record: any) => {
        const displayName = record?.productName
          ? `${record?.productName} (${record?.name})`
          : record?.name;
        return <span>{displayName}</span>;
      },
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (value: string, record: any) => {
        return (
          <CustomInput
            onChange={(newValue: any) =>
              handleQuantityChange(newValue, record.variantId)
            }
            className="suffix-icon w-[50%] mx-auto text-center h-11 !rounded"
            type="number"
            placeholder="Nhập số lượng"
            value={formatNumber(value)}
          />
        );
      },
    },
    {
      title: "Đơn vị tính",
      dataIndex: "product",
      key: "unit",
      align: "center",
      render: (product: any) => {
        return <span>{product?.unit}</span>;
      },
    },
    {
      title: t("unitPrice"),
      dataIndex: "price",
      key: "price",
      render: (value: string) => formatMoney(value),
    },
    {
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record: any) => {
        return (
          <div onClick={() => deleteSingle(record?.variantId)}>
            <Image src={CloseIcon} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="mt-6">
        <CustomTable
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: number[] | any) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          dataSource={dataSource?.map((item, index) => ({
            ...item,
            key: item.variantId,
            name: item?.name,
            price: item?.price,
            unit: item?.unit?.name || item?.unit,
          }))}
          columns={columns}
          rowClassName={() => "hover-row"}
        />
      </div>
    </>
  );
};

export default TableVariant;

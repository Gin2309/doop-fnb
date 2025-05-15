import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import CustomActionHeader from "@/components/CustomActionHeader";
import { formatMoney } from "@/helpers";
import { formatNumber } from "@/helpers";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import Header from "./CustomHeader";
import DeleIcon from "@/assets/deleteRed.svg";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllCombo, deleteMultiple } from "@/api/combo.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { message } from "antd";

const Combo = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const branchId = Number(branch?.id);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId: branchId,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const { data, isLoading, refetch } = useQuery(["CUSTOMER", formFilter], () =>
    getAllCombo(formFilter)
  );

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation(
    (ids: number[] | any) => deleteMultiple(branchId, ids),
    {
      onSuccess: () => {
        message.success("Xóa combo thành công!");
        setSelectedRowKeys([]);
        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onDelete = () => {
    deleteMutation(selectedRowKeys);
  };

  const columns: ColumnsType<any> = [
    {
      title: (
        <div className="flex justify-start items-center">
          {selectedRowKeys?.length > 0 && (
            <div
              className=" absolute left-4 bottom-2 cursor-pointer"
              onClick={onDelete}
            >
              <Image src={DeleIcon} className="w-5 h-5" />
            </div>
          )}
        </div>
      ),
      dataIndex: "index",
      key: "index",
    },
    {
      title: t("comboName"),
      dataIndex: "name",
      key: "name",
      render: (value: string) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
        >
          {value}
        </button>
      ),
    },
    {
      title: t("productsQuantity"),
      dataIndex: "countVariant",
      key: "countVariant",
      align: "center",
      render: (value: string) => (value ? formatNumber(value) : 0),
    },
    {
      title: t("sellPrice"),
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (value: string) => (value ? formatMoney(value) : "-"),
    },
  ];

  const CustomBtn = () => {
    return (
      <CustomButton
        type="primary"
        wrapClassName="mx-2"
        prefixIcon={<Image src={PlusIcon} />}
        onClick={() => router.push("/products/combo/add-combo")}
      >
        {t("addCombo")}
      </CustomButton>
    );
  };

  return (
    <>
      <CustomActionHeader
        title="comboList"
        type="custom"
        CustomBtn={CustomBtn}
      />

      <div className="card">
        <Header setFormFilter={setFormFilter} />

        <CustomTable
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: number[] | any) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          dataSource={data?.data?.content}
          columns={columns}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => router.push(`/products/combo/${record.id}`),
          })}
          rowKey="id"
          rowClassName={() => "hover-row"}
          scroll={{ x: 900 }}
        />

        <CustomPagination
          page={formFilter.page}
          pageSize={formFilter.limit}
          total={data?.data?.totalElements}
          setPage={(value) => setFormFilter({ ...formFilter, page: value })}
          setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        />
      </div>
    </>
  );
};

export default Combo;

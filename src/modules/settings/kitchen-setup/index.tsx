import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { formatNumber } from "@/helpers";
import { ColumnsType } from "antd/es/table";

import { useQuery } from "@tanstack/react-query";
import { getBar } from "@/api/kitchen.service";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const Kitchen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);
  const [formFilter, setFormFilter] = useState({
    branchId: branch?.id,
    keyword: "",
  });
  const { data, isLoading } = useQuery(["BAR", formFilter], () =>
    getBar(formFilter)
  );

  const CustomBtn = () => {
    return (
      <CustomButton
        type="primary"
        wrapClassName="mx-2"
        prefixIcon={<Image src={PlusIcon} />}
        onClick={() => router.push("/settings/kitchen-setup/add-bar")}
      >
        {t("addBar")}
      </CustomButton>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: t("barName"),
      dataIndex: "name",
      key: "name",
      align: "start",
      width: "60%",
    },
    {
      title: t("itemQuantity"),
      dataIndex: "countProduct",
      key: "countProduct",
      align: "center",
      width: "40%",
      render: (value: number) => (value ? formatNumber(value) : 0),
    },
  ];

  return (
    <>
      <div className="px-8 mb-6">
        <CustomActionHeader
          title="kitchenSetup"
          type="custom"
          CustomBtn={CustomBtn}
        />

        <div className="card">
          <h1 className="mb-2 text-[#666666] font-medium">
            Tổng số: {data?.data?.length || 0} bếp
          </h1>
          <CustomTable
            dataSource={data?.data}
            columns={columns}
            rowClassName={() => "hover-row"}
            loading={isLoading}
            onRow={(record) => ({
              onClick: () =>
                router.push(`/settings/kitchen-setup/${record.id}`),
            })}
          />
        </div>
      </div>
    </>
  );
};

export default Kitchen;

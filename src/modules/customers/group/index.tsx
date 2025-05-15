import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import Image from "next/image";
import CustomTable from "@/components/CustomTable";
import { CustomButton } from "@/components/CustomButton";
import { ColumnsType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import down from "@/assets/whiteChervonDown.svg";
import Import from "@/assets/GrayFileArrowUp.svg";
import GrayPlus from "@/assets/GrayPlus.svg";
import Header from "./CustomHeader";

import { useQuery } from "@tanstack/react-query";
import { getCustomerGroupList } from "@/api/customer-group.service";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

interface CustomerGroupRecord {
  key: number;
  id: number;
  groupName: string;
  discount: string;
  chainLink: boolean;
  description: string;
}

const CustomerGroup = () => {
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

  const { data, isLoading } = useQuery(["CUSTOMER", formFilter], () =>
    getCustomerGroupList(formFilter)
  );

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href="/customers/group/add-customer-group">
          <div className="p-2 flex gap-2 items-center">
            <Image src={GrayPlus} />
            <div className=" text-[#333333]">{t("addCustomerGroup")}</div>
          </div>
        </Link>
      ),
    },
    {
      key: "divider",
      type: "divider",
      style: { borderColor: "#E5E5E5" },
    },
    {
      key: "2",
      label: (
        <div className="p-2 flex gap-2 items-center">
          <Image src={Import} />
          <div className="text-[#333333]">{t("importList")}</div>
        </div>
      ),
    },
  ];

  const CustomBtn = () => {
    return (
      <>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          placement="bottomRight"
          arrow
        >
          <CustomButton
            type="primary"
            wrapClassName="mx-2"
            prefixIcon={<Image src={PlusIcon} />}
            suffixIcon={
              <div className="mt-1">
                <Image src={down} />
              </div>
            }
          >
            {t("addCustomerGroup")}
          </CustomButton>
        </Dropdown>
      </>
    );
  };

  const columns: ColumnsType<CustomerGroupRecord> = [
    {
      title: t("groupName"),
      dataIndex: "name",
      key: "groupName",
      align: "center",
      render: (value: string) => (
        <button
          style={{
            color: "#1890ff",
            cursor: "pointer",
          }}
          // onClick={() => handleRowClick(record)}
        >
          {value}
        </button>
      ),
    },
    {
      title: t("hourlyDiscount"),
      dataIndex: "hourDiscount",
      key: "hourlyDiscount",
      render: (value: string) => (value ? `${value}%` : "-"),
      align: "center",
    },
    {
      title: t("foodDiscount"),
      dataIndex: "foodDiscount",
      key: "foodDiscount",
      render: (value: string) => (value ? `${value}%` : "-"),
      align: "center",
    },
    {
      title: t("ortherDiscount"),
      dataIndex: "otherDiscount",
      key: "ortherDiscount",
      render: (value: string) => (value ? `${value}%` : "-"),
      align: "center",
    },
    {
      title: t("chainLink"),
      dataIndex: "isBranchChainLink",
      key: "chainLink",
      align: "center",
      render: (value: boolean) => <CustomCheckbox checked={value} />,
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      align: "center",
    },
  ];

  return (
    <>
      <CustomActionHeader
        title="customerGroup"
        type="custom"
        CustomBtn={CustomBtn}
      />

      <div className="card">
        <Header setFormFilter={setFormFilter} />

        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={data?.data?.content}
          columns={columns}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => router.push(`/customers/group/${record.id}`),
          })}
          rowClassName={() => "hover-row"}
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

export default CustomerGroup;

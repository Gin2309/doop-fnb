import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { ColumnType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";

import CloseCircleGrayIcon from "@/assets/close.svg";
import Search from "../Search";

import { useQuery } from "@tanstack/react-query";
import { getCustomerList } from "@/api/customer.service";

const AddModal = ({
  isOpen,
  onCancel,
  onSubmit,
  branchId,
  onUserSelection,
  userIds,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  branchId: number;
  onUserSelection: any;
  userIds: any;
}) => {
  const { t } = useTranslation();
  const [customerIds, setCustomerIds] = useState<any>(userIds);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId: branchId,
  });

  useEffect(() => {
    setCustomerIds(userIds);
  }, [userIds]);

  const { data, isLoading, refetch } = useQuery(
    ["CUSTOMER", isOpen, formFilter],
    () => getCustomerList(formFilter)
  );

  const handleCancel = () => {
    onCancel();
  };

  const handleAdd = () => {
    const selectedCustomers =
      data?.data?.content.filter((customer) =>
        customerIds.includes(customer.id)
      ) || [];
    if (selectedCustomers.length > 0) {
      onUserSelection(selectedCustomers);
    }
    handleCancel();
  };

  const columns: ColumnType<any>[] = [
    {
      dataIndex: "code",
      render: (value) => (
        <span className="cursor-pointer text-[#1890ff]">{value}</span>
      ),
    },
    {
      dataIndex: "name",
      render: (value) => <span>{value}</span>,
    },
    {
      dataIndex: "phone",
      render: (value) => <span>{value}</span>,
    },
  ];

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={handleCancel}
      onSubmit={onSubmit}
      customFooter
      centered
      title={t("addCustomerToGroup")}
      width={1000}
    >
      <div>
        <div className="flex flex-col gap-6 mb-6">
          <Search setFormFilter={setFormFilter} />

          <CustomTable
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: customerIds,
              onChange: (selectedRowKeys) => {
                setCustomerIds(selectedRowKeys);
              },
            }}
            showHeader={false}
            dataSource={data?.data?.content}
            columns={columns}
            scroll={{ x: 900 }}
            loading={isLoading}
            rowClassName={() => "hover-row"}
            rowKey="id"
          />

          <CustomPagination
            page={formFilter.page}
            pageSize={formFilter.limit}
            total={data?.data?.totalElements}
            setPage={(value) => setFormFilter({ ...formFilter, page: value })}
            setPerPage={(value) =>
              setFormFilter({ ...formFilter, limit: value })
            }
          />
        </div>

        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            type="original"
            onClick={handleCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            // disabled={isAdding}
            className="!h-11 !w-[120px]"
            onClick={handleAdd}
            type="primary"
          >
            {t("add")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default AddModal;

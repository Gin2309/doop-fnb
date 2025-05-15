import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { ColumnType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import Search from "../Search";

import CloseCircleGrayIcon from "@/assets/close.svg";

import { useMutation, useQuery } from "@tanstack/react-query";
import { addToGroup } from "@/api/customer-group.service";
import { getCustomerList } from "@/api/customer.service";
import { message } from "antd";

const AddModal = ({
  isOpen,
  onCancel,
  branchId,
  id,
  refetch,
  allId,
}: {
  isOpen: boolean;
  onCancel: () => void;
  branchId: number;
  id: any;
  refetch: any;
  allId: any;
}) => {
  const { t } = useTranslation();
  const [customerIds, setCustomerIds] = useState<any>([]);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    branchId: branchId,
  });

  useEffect(() => {
    setCustomerIds(allId);
  }, [allId]);

  const { data, isLoading } = useQuery(["CUSTOMER", formFilter, isOpen], () =>
    getCustomerList(formFilter)
  );

  const handleCancel = () => {
    onCancel();
  };

  const { mutate: addCustomerMutation, isLoading: isAdding } = useMutation(
    (data: any) => addToGroup(data, id),
    {
      onSuccess: () => {
        message.success("Thêm khách hàng thành công!");
        refetch();
        handleCancel();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const handleSubmit = () => {
    const uniqueCustomerIds = customerIds.filter((id) => !allId.includes(id));

    if (uniqueCustomerIds.length > 0) {
      const data = {
        branchId,
        customerIds: uniqueCustomerIds,
      };
      addCustomerMutation(data);
    } else {
      message.warning("Khách hàng đã ở trong nhóm.");
    }
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
      onSubmit={handleSubmit}
      customFooter
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
            isLoading={isAdding}
            className="!h-11 !w-[120px]"
            onClick={handleSubmit}
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

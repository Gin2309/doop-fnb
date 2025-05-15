import Image from "next/image";
import DinningTable from "@/assets/DinningTable.svg";
import styled from "styled-components";
import { message, Modal } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPositonOpen } from "@/api/area-pos.service";
import { ColumnsType } from "antd/es/table";
import CustomTable from "@/components/CustomTable";
import { useEffect, useState } from "react";
import { formatMoney } from "@/helpers";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { customMessage } from "@/utils/messageHelper";
import { getDetailTable } from "@/api/current-bill-item.service";

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
    padding: 0;
  }

  .ant-modal-header {
    background-color: rgba(255, 244, 240, 1);
    border-bottom: none;
    padding: 16px;
    border-radius: 8px 8px 0 0;
  }

  .ant-modal-body {
    padding: 24px;
  }
`;

export default function ModalOpenTable({
  positionSelect,
  openModal,
  setOpenModal,
  tableId,
  branchId,
  customSubmitFn,
  onCancel
}: {
  positionSelect: any;
  openModal: boolean;
  setOpenModal: any;
  tableId: any;
  branchId: any;
  customSubmitFn?:(data: {
    branchId: number;
    positionId: number;
    itemsRequest: Array<{
      productId: number;
      quantity: number;
      variantId: number;
      itemPrice: number;
      groups: any[];
    }>
  }) => void;
  onCancel?:() => void;
}) {
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const columns: ColumnsType<any> = [
    {
      title: "Tên mặt hàng",
      dataIndex: "product",
      key: "product",
      align: "start",
      render: (product, record) => {
        return (
          <span>
            {record?.product?.name} ({record?.variant?.name})
          </span>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: string | any, record) => <span>x{value}</span>,
      align: "end",
    },
    {
      title: "Đơn vị tính",
      dataIndex: "product",
      key: "product",
      render: (product, record) => {
        return <span>{product?.unit}</span>;
      },
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "variant",
      key: "variant",
      render: (variant, record) => {
        return <span>{formatMoney(variant?.price)}</span>;
      },
      align: "center",
    },
  ];

  const { handleSubmit, control } = useForm();

  const handleRowSelectionChange = (
    selectedRowKeys: any,
    selectedRows: any[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);

    const selectedItemDetails = selectedRows.map((item: any) => ({
      variantId: item?.variant?.id,
      quantity: item?.quantity,
      itemPrice: item?.variant?.price,
      groups: [],
    }));

    setSelectedItems(selectedItemDetails);
  };

  useEffect(() => {
    const preselectedItems = positionSelect?.defaultService?.map(
      (item: any) => item.id
    );
    setSelectedRowKeys(preselectedItems);

    const preselectedItemDetails = positionSelect?.defaultService?.map(
      (item) => ({
        variantId: item?.variant?.id,
        quantity: item?.quantity,
        itemPrice: item?.variant?.price,
        groups: [],
      })
    );
    setSelectedItems(preselectedItemDetails);
  }, [positionSelect]);

  const { mutate: mutate } = useMutation(
    (data: any) => createPositonOpen(data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        await queryClient.invalidateQueries(["POS"]);
        customMessage.success("Thao tác thành công");
        router.push(`/pos/diagram/${positionSelect.id}`);

        handleCancel();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleFormSubmit = () => {
    const data = {
      branchId: branch?.id,
      positionId: positionSelect?.id,
      itemsRequest: selectedItems,
    };

    if (customSubmitFn && typeof customSubmitFn === "function") {
      customSubmitFn(data);
    } else {
      mutate(data);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedRowKeys([]);
    setSelectedItems([]);
    if (onCancel && typeof onCancel === "function") {
      onCancel();
    }
  };

  const { data: positionData, isLoading } = useQuery(
    ["POSITION"],
    () => getDetailTable(tableId, branchId),
    {
      enabled: openModal,
    }
  );

  const defaultService = positionData?.data?.position?.defaultService;

  return (
    <StyledModal
      open={openModal}
      onCancel={() => {
        setOpenModal(false);
      }}
      centered
      title=""
      width={750}
      footer={null}
    >
      <div className="p-5 text-center">
        <Image src={DinningTable} />
        <p className="font-bold text-xl">Xác nhận mở bàn</p>
      </div>
      <div>
        <CustomTable
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: handleRowSelectionChange,
          }}
          columns={columns}
          loading={isLoading}
          dataSource={defaultService}
          rowClassName={() => "hover-row"}
          rowKey="id"
        />
      </div>
      <div className="flex justify-center gap-[10px] border-t-[1px] w-full px-[15px] h-[72px] items-center">
        <CustomButton
          type="original"
          wrapClassName="w-1/2"
          onClick={handleCancel}
        >
          Huỷ
        </CustomButton>

        <CustomButton
          type="primary"
          wrapClassName="w-1/2"
          onClick={handleSubmit(handleFormSubmit)}
        >
          Xác nhận mở
        </CustomButton>
      </div>
    </StyledModal>
  );
}

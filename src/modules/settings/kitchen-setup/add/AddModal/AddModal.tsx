import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { ColumnType } from "antd/es/table";
import CustomPagination from "@/components/CustomPagination";
import { formatMoney } from "@/helpers";
import { isColorAvatar } from "@/utils";
import CloseCircleGrayIcon from "@/assets/close.svg";
import Search from "./Search copy";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product.service";
import { CustomCheckbox } from "@/components/CustomCheckbox";

const AddModal = ({
  isOpen,
  onCancel,
  onSubmit,
  branchId,
  onSelection,
  Ids,
  onRemove,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  branchId: number;
  onSelection: (ids: any) => void;
  Ids: any;
  onRemove: any;
}) => {
  const { t } = useTranslation();
  const [productIds, setProductIds] = useState<any[]>([]);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    branchId: branchId,
  });
  const productIdsRef = useRef<any[]>([]);

  const handleCancel = () => {
    onCancel();
  };

  const { data, isLoading } = useQuery(["PRODUCT", formFilter], () =>
    getProducts(formFilter)
  );

  useEffect(() => {
    setProductIds(Ids);
  }, [Ids, data]);

  const handleAdd = () => {
    const filteredProductIds = productIds.filter(
      (productId) => !Ids.includes(productId)
    );

    const submitData = data?.data?.content.filter((product) =>
      filteredProductIds.includes(product.id)
    );

    if (submitData.length > 0) {
      onSelection(submitData);
    }

    handleCancel();
  };

  const columns: ColumnType<any>[] = [
    {
      dataIndex: "avatarUrl",
      width: "100px",
      render: (value) => {
        if (!value) return null;

        return isColorAvatar(value) ? (
          <div
            className="h-[60px] w-[60px] rounded-md"
            style={{ backgroundColor: value }}
          ></div>
        ) : (
          <Image
            src={value}
            alt="Avatar"
            className="h-[60px] w-[60px] rounded-md"
            width={60}
            height={60}
          />
        );
      },
    },
    {
      dataIndex: "name",
      align: "start",
      render: (value) => (
        <span className="cursor-pointer text-[#1890ff]">{value}</span>
      ),
    },
    {
      dataIndex: "price",
      align: "right",
      render: (_, record) => {
        const variantCount = record.variants.length;

        return variantCount === 1 ? (
          <span>{formatMoney(record.variants[0].price)}</span>
        ) : (
          <span>{variantCount} giá</span>
        );
      },
    },
  ];

  const handleRowSelectionChange = (selectedRowKeys: any[]) => {
    setProductIds(selectedRowKeys);

    const removedProductIds = productIdsRef.current.filter(
      (id: any) => !selectedRowKeys.includes(id)
    );

    removedProductIds.forEach((id) => onRemove(id));

    productIdsRef.current = selectedRowKeys;
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="Close Icon" />}
      isOpen={isOpen}
      onCancel={handleCancel}
      onSubmit={onSubmit}
      customFooter
      title="Thêm mặt hàng,combo, khuyến mại"
    >
      <div>
        <div className="flex flex-col gap-6 mb-6">
          <Search setFormFilter={setFormFilter} onClick={() => {}} />

          <CustomTable
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: productIds,
              onChange: (selectedRowKeys) => {
                handleRowSelectionChange(selectedRowKeys);
              },
            }}
            showHeader={false}
            dataSource={data?.data?.content}
            columns={columns}
            scroll={{ x: 600 }}
            loading={isLoading}
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
            outline
            className="!h-11 !w-[120px]"
            type="original"
            onClick={handleCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
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

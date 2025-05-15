import { useEffect, useState, useRef } from "react";
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
  variantId,
  onRemove,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  branchId: number;
  onSelection: any;
  Ids: any;
  variantId: any;
  onRemove: any;
}) => {
  const { t } = useTranslation();
  const [productIds, setProductIds] = useState<any>([]);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    branchId: branchId,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);
  const productIdsRef = useRef<any[]>([]);

  const handleCancel = () => {
    onCancel();
  };

  const { data, isLoading } = useQuery(
    ["PRODUCT", formFilter],
    () => getProducts(formFilter),
    {
      select: (data) => {
        const uniqueProducts = data?.data?.content.reduce(
          (acc: any[], product: any) => {
            if (!acc.some((item) => item.id === product.id)) {
              acc.push(product);
            }
            return acc;
          },
          []
        );

        return uniqueProducts.map((product) => ({
          ...product,
          variants: product.variants.map((variant: any) => ({
            ...variant,
            productName: product.name,
            avatarUrl: product.avatarUrl,
            price: variant.price,
            rowKey: `${product.id}-${variant.id}`,
          })),
        }));
      },
    }
  );

  useEffect(() => {
    // const filteredIDs = Ids.filter((id) => typeof id === "number");
    // productIdsRef.current = filteredIDs;
    setProductIds(Ids);
    setExpandedRowKeys(data ? data.map((product) => product.id) : []);
  }, [Ids, data]);

  const getVariantIds = (productIds: any) => {
    return productIds
      .filter((id) => typeof id === "string" && id.includes("-"))
      .map((id) => parseInt(id.split("-")[1]));
  };

  const handleAdd = () => {
    const uniqueProducts = data?.reduce((acc: any[], product: any) => {
      if (!acc.some((item) => item.id === product.id)) {
        acc.push(product);
      }
      return acc;
    }, []);

    const flattenedProducts = uniqueProducts.flatMap((product) =>
      product.variants.map((variant: any) => ({
        id: variant.id,
        product: {
          avatarUrl: product.avatarUrl,
          name: product.name,
          id: product.id,
        },
        name: variant.name,
        price: variant.price,
        quantity: 1,
      }))
    );

    const variant = getVariantIds(productIds);

    const selectedProducts =
      flattenedProducts?.filter((item) => variant.includes(item.id)) || [];

    const filteredProducts = selectedProducts.filter(
      (item) => !variantId.includes(item.id)
    );

    if (filteredProducts.length > 0) {
      onSelection(filteredProducts);
    }

    onCancel();
  };

  const columns: ColumnType<any>[] = [
    {
      dataIndex: "avatarUrl",
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
  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={handleCancel}
      onSubmit={onSubmit}
      customFooter
      title="Thêm mặt hàng vào combo"
    >
      <div>
        <div className="flex flex-col gap-6 mb-6">
          <Search setFormFilter={setFormFilter} onClick={() => {}} />

          <CustomTable
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: productIds,
              onChange: (selectedRowKeys) => {
                const selectedProductIds = new Set(selectedRowKeys);

                selectedRowKeys.forEach((key) => {
                  const keyStr = String(key);
                  const [productId, variantId]: any = keyStr.split("-");

                  if (!variantId) {
                    data.forEach((product) => {
                      if (product.id === parseInt(productId)) {
                        product.variants.forEach((variant: any) => {
                          selectedProductIds.add(`${product.id}-${variant.id}`);
                        });
                      }
                    });
                  }

                  if (variantId) {
                    selectedProductIds.add(`${productId}`);
                  }
                });

                setProductIds(Array.from(selectedProductIds));

                // const removedProductIds = productIdsRef.current.filter(
                //   (id: any) => !selectedRowKeys.includes(id)
                // );

                // removedProductIds.forEach((id) => onRemove(id));

                // productIdsRef.current = selectedRowKeys;
              },
            }}
            showHeader={false}
            dataSource={data}
            columns={columns}
            scroll={{ x: 600 }}
            loading={isLoading}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) =>
                record.variants.length > 1 ? (
                  <div>
                    {record.variants.map((variant: any, index: number) => (
                      <div
                        key={variant.id}
                        className={`flex justify-between py-6 ${
                          index !== record.variants.length - 1
                            ? "border-b border-[#f6f6f6]"
                            : ""
                        } ${
                          productIds.includes(`${record.id}-${variant.id}`)
                            ? "bg-[#fff2e4]"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-8 ml-[80px]">
                          <CustomCheckbox
                            checked={productIds.includes(
                              `${record.id}-${variant.id}`
                            )}
                            onChange={() =>
                              setProductIds((prev) =>
                                prev.includes(`${record.id}-${variant.id}`)
                                  ? prev.filter(
                                      (id) =>
                                        id !== `${record.id}-${variant.id}`
                                    )
                                  : [...prev, `${record.id}-${variant.id}`]
                              )
                            }
                          />
                          <span className="cursor-pointer text-[#1890ff]">
                            {variant.name}
                          </span>
                        </div>
                        <span className="mr-4">
                          {formatMoney(variant.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null,
              rowExpandable: (record) => record.variants.length > 1,
              expandIcon: () => null,
              expandedRowKeys: expandedRowKeys,
            }}
            onRow={(record) => ({
              onClick: () => {
                if (record.variants.length > 1) {
                  setExpandedRowKeys((prev) =>
                    prev.includes(record.id)
                      ? prev.filter((key) => key !== record.id)
                      : [...prev, record.id]
                  );
                }
              },
            })}
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

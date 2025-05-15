import Image from "next/image";
import { useTranslation } from "react-i18next";
import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/api/product.service";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { formatCurrency, isColorAvatar } from "@/utils";
import { debounce } from "lodash";
import { Dropdown, MenuProps, Space } from "antd";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import { CustomInput } from "@/components/CustomInput";
import SearchIcon from "@/assets/searchIcon.svg";
import CustomPagination from "@/components/CustomPagination";

type Variant = {
  variantId: number;
  name: string;
  quantity: number;
  avatarUrl: string;
  price: number;
  productName: string;
};

const ModalFreeItems = ({
  isOpen,
  onCancel,
  onAddVariants,
  selectedVariants = [],
}: {
  isOpen: boolean;
  onCancel: () => void;
  onAddVariants: (variants: Variant[]) => void;
  selectedVariants: Variant[];
}) => {
  const { t } = useTranslation();
  const branch = useRecoilValue(branchStateSession);

  const [localSelectedVariants, setLocalSelectedVariants] =
    useState<Variant[]>(selectedVariants);

  useEffect(() => {
    setLocalSelectedVariants(selectedVariants);
  }, [selectedVariants]);

  const [formFilterProduct, setFormFilterProduct] = useState({
    limit: 100,
    page: 1,
    branchId: branch?.id,
    keyword: "",
  });

  const { data: products } = useQuery(["PRODUCT", formFilterProduct], () =>
    getProducts(formFilterProduct)
  );

  const handleFilterType = (filterType: string) => {
    setFormFilterProduct((prev) => ({
      ...prev,
      type: filterType,
    }));
  };

  const handleCheckboxChange = (variantOrProduct, isProduct = false) => {
    let avatarUrl = "";
    let productName = "";

    if (isProduct) {
      avatarUrl = variantOrProduct.avatarUrl;
      productName = variantOrProduct.name;
    } else {
      const product = products?.data?.content?.find(
        (product) => product.id === variantOrProduct.productId
      );

      if (product) {
        avatarUrl = product.avatarUrl;
        productName = product.name;
      }
    }

    if (isProduct) {
      const allVariantsSelected = variantOrProduct.variants.every((variant) =>
        localSelectedVariants.some((v) => v.variantId === variant.id)
      );

      if (allVariantsSelected) {
        const updated = localSelectedVariants.filter(
          (v) =>
            !variantOrProduct.variants.some(
              (variant) => variant.id === v.variantId
            )
        );
        setLocalSelectedVariants(updated);
      } else {
        const newVariants = variantOrProduct.variants
          .filter(
            (variant) =>
              !localSelectedVariants.some((v) => v.variantId === variant.id)
          )
          .map((variant) => ({
            variantId: variant.id,
            name: variant.name,
            quantity: 1,
            avatarUrl,
            productName,
            price: variant.price,
          }));
        setLocalSelectedVariants([...localSelectedVariants, ...newVariants]);
      }
    } else {
      const { id: variantId, name, price } = variantOrProduct;
      const existingIndex = localSelectedVariants.findIndex(
        (v) => v.variantId === variantId
      );

      if (existingIndex >= 0) {
        const updated = localSelectedVariants.filter(
          (v) => v.variantId !== variantId
        );
        setLocalSelectedVariants(updated);
      } else {
        setLocalSelectedVariants([
          ...localSelectedVariants,
          { variantId, name, quantity: 1, avatarUrl, productName, price },
        ]);
      }
    }
  };

  const handleAddVariants = () => {
    onAddVariants(localSelectedVariants);
    onCancel();
  };

  const handleCancel = () => {
    setLocalSelectedVariants(selectedVariants);
    onCancel();
  };

  const secondaryItems: MenuProps["items"] = [
    {
      key: "",
      label: <span onClick={() => handleFilterType("")}>Tất cả sản phẩm</span>,
    },
    {
      key: "QUANTITY",
      label: (
        <span onClick={() => handleFilterType("QUANTITY")}>
          Tính tiền theo số lượng
        </span>
      ),
    },
    {
      key: "WEIGHT",
      label: (
        <span onClick={() => handleFilterType("WEIGHT")}>
          Tính tiền theo trọng lượng
        </span>
      ),
    },
    {
      key: "TIME",
      label: (
        <span onClick={() => handleFilterType("TIME")}>
          Tính tiền theo thời gian
        </span>
      ),
    },
  ];

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={handleCancel}
      customFooter
      title={t("linkedProduct")}
      width={900}
    >
      <div>
        <div className="mb-6">
          <Space.Compact block>
            <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
              <Dropdown menu={{ items: secondaryItems }}>
                <Space>
                  <div className="flex items-center justify-between w-[180px]">
                    <div>
                      <Image src={FilterIcon} />
                      <span className="mx-2 cursor-pointer">Lọc mặt hàng</span>
                    </div>
                    <Image src={DropIcon} />
                  </div>
                </Space>
              </Dropdown>
            </div>
            <CustomInput
              placeholder="Tìm kiếm "
              prefixIcon={<Image src={SearchIcon} alt="" />}
              className="!h-[44px]"
              wrapClassName=" flex-1 "
              onChange={debounce((value) => {
                setFormFilterProduct({
                  ...formFilterProduct,
                  keyword: value,
                  page: 1,
                });
              }, 300)}
            />
          </Space.Compact>
          <div className="mt-[15px] max-h-[600px] overflow-y-scroll">
            {products?.data?.content
              ?.filter((item) =>
                item.variants.some(
                  (variant) =>
                    !selectedVariants.some((v) => v.variantId === variant.id)
                )
              )
              .map((item) => (
                <div key={item?.id} className="border-b">
                  <div className="flex justify-between items-center p-3">
                    <div className="flex gap-5">
                      <CustomCheckbox
                        checked={item.variants.every((variant) =>
                          localSelectedVariants.some(
                            (v) => v.variantId === variant.id
                          )
                        )}
                        onChange={() => handleCheckboxChange(item, true)}
                      />

                      <div className="flex items-center gap-3">
                        {isColorAvatar(item.avatarUrl) ? (
                          <div
                            className="w-[40px] h-[40px] rounded-lg"
                            style={{ backgroundColor: item.avatarUrl }}
                          />
                        ) : (
                          <Image
                            width={40}
                            height={40}
                            alt="cafe"
                            src={item.avatarUrl || "/images/services1.png"}
                          />
                        )}
                        <p className="text-[#3355FF]">{item?.name}</p>
                      </div>
                    </div>
                    <p>
                      {item?.variants?.length > 1
                        ? `${item?.variants?.length} giá`
                        : formatCurrency(item.variants[0]?.price)}
                    </p>
                  </div>

                  {item?.variants?.length > 1 && (
                    <div className="pl-10">
                      {item.variants
                        .filter(
                          (variant) =>
                            !selectedVariants.some(
                              (v) => v.variantId === variant.id
                            )
                        )
                        .map((variant) => (
                          <div
                            key={variant.id}
                            className="flex justify-between items-center p-2"
                          >
                            <div className="flex gap-8 items-center">
                              <CustomCheckbox
                                checked={localSelectedVariants.some(
                                  (v) => v.variantId === variant.id
                                )}
                                onChange={() => handleCheckboxChange(variant)}
                              />
                              <p>{variant?.name || "N/A"}</p>
                            </div>
                            <p>{formatCurrency(variant.price)}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <CustomPagination
            page={formFilterProduct.page}
            pageSize={formFilterProduct.limit}
            total={products?.data?.totalElements}
            setPage={(value) =>
              setFormFilterProduct({ ...formFilterProduct, page: value })
            }
            setPerPage={(value) =>
              setFormFilterProduct({ ...formFilterProduct, limit: value })
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
            type="primary"
            onClick={handleAddVariants}
          >
            {t("add")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalFreeItems;

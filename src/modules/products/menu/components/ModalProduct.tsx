import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import { Dropdown, MenuProps, Space, Spin } from "antd";
import FilterIcon from "@/assets/filter.svg";
import DropIcon from "@/assets/Select.svg";
import Image from "next/image";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import Item1 from "@/assets/images/item1.png";
import { formatCurrency, isColorAvatar } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { branchStateSession } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { getProducts } from "@/api/product.service";
import { getAllCombo } from "@/api/combo.service";

const ModalProduct = ({
  title,
  isOpen,
  onCancel,
  setValue,
  getValues,
  productToShow,
  setProductToShow,
}: {
  title: string;
  isOpen: boolean;
  setValue: any;
  getValues: any;
  productToShow: any;
  setProductToShow: any;
  onCancel: () => void;
}) => {
  const [selectedFilter, setSelectedFilter] = useState("productId");
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
    getValues("productIds") || []
  );
  const [selectedProductToShow, setSelectedProductToShow] = useState<number[]>(
    productToShow || []
  );
  const branch = useRecoilValue(branchStateSession);
  const [inputValue, setInputValue] = useState("");

  const [formFilterProduct, setFormFilterProduct] = useState({
    limit: 5,
    page: 1,
    branchId: branch?.id,
    keyword: "",
  });

  const [formFilterCombo, setFormFilterCombo] = useState({
    limit: 5,
    page: 1,
    branchId: branch?.id,
    keyword: "",
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCombos, setTotalCombos] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleDeleteKeyword = () => {
    setFormFilterProduct({
      ...formFilterProduct,
      keyword: "",
    });

    setFormFilterCombo({
      ...formFilterCombo,
      keyword: "",
    });

    setInputValue("");
  };

  const handleInputChange = (value) => {
    setInputValue(value);

    debounce(() => {
      if (selectedFilter === "product") {
        setFormFilterProduct({ ...formFilterProduct, keyword: value });
      } else {
        setFormFilterCombo({ ...formFilterCombo, keyword: value });
      }
    }, 300)();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span
          onClick={() => {
            setSelectedFilter("product");
            handleDeleteKeyword();
          }}
        >
          Tất cả mặt hàng
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          onClick={() => {
            setSelectedFilter("combo");
            handleDeleteKeyword();
          }}
        >
          Tất cả combo
        </span>
      ),
    },
  ];

  const handleCheckboxChange = (item, checked: boolean) => {
    let updatedProductIds = [...selectedProductIds];
    let updatedProductToShow = [...selectedProductToShow];
    if (checked) {
      updatedProductIds.push(item.id);
      updatedProductToShow.push(item);
    } else {
      updatedProductIds = updatedProductIds.filter(
        (productId) => productId !== item.id
      );
      updatedProductToShow = updatedProductToShow.filter(
        (product: any) => product?.id !== item.id
      );
    }
    setSelectedProductIds(updatedProductIds);
    setSelectedProductToShow(updatedProductToShow);
  };

  const handleSubmit = () => {
    setValue("productIds", selectedProductIds);
    setProductToShow(selectedProductToShow);
    onCancel();
  };

  const { data: products, isFetching: isFetchingProducts } = useQuery(
    ["PRODUCT", formFilterProduct],
    async () => {
      const response = await getProducts(formFilterProduct);
      setTotalProducts(response?.data?.totalElements || 0); // Gán tổng số phần tử cho product
      return response;
    },
    {
      keepPreviousData: true,
    }
  );

  const { data: combos, isFetching: isFetchingCombos } = useQuery(
    ["COMBO", formFilterCombo],
    async () => {
      const response = await getAllCombo(formFilterCombo);
      setTotalCombos(response?.data?.totalElements || 0); // Gán tổng số phần tử cho combo
      return response;
    },
    {
      keepPreviousData: true,
    }
  );

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: any) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loadingMore) {
          const isProductSelected = selectedFilter === "product";
          const hasMoreProducts =
            products?.data?.content?.length < totalProducts;
          const hasMoreCombos = combos?.data?.content?.length < totalCombos;

          if (
            (isProductSelected && hasMoreProducts && !isFetchingProducts) ||
            (!isProductSelected && hasMoreCombos && !isFetchingCombos)
          ) {
            setLoadingMore(true);
            if (isProductSelected) {
              setFormFilterProduct((prev) => ({
                ...prev,
                limit: prev.limit + 20,
              }));
            } else {
              setFormFilterCombo((prev) => ({
                ...prev,
                limit: prev.limit + 20,
              }));
            }
          }
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [
    loadingMore,
    selectedFilter,
    products,
    combos,
    isFetchingProducts,
    isFetchingCombos,
  ]);

  useEffect(() => {
    if (!isFetchingProducts && !isFetchingCombos) {
      setLoadingMore(false);
    }
  }, [isFetchingProducts, isFetchingCombos]);

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={title}
      width={1000}
      onSubmit={handleSubmit}
      textOk="Thêm"
    >
      <Space.Compact block>
        <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
          <Dropdown menu={{ items }}>
            <Space>
              <div className="flex items-center">
                <Image src={FilterIcon} />
                <span className="mx-2 cursor-pointer">
                  {selectedFilter === "product"
                    ? "Tất cả mặt hàng"
                    : "Tất cả combo"}
                </span>
                <Image src={DropIcon} />
              </div>
            </Space>
          </Dropdown>
        </div>
        {selectedFilter === "product" ? (
          <CustomInput
            value={inputValue} // Gán giá trị input từ state
            placeholder="Tìm kiếm mặt hàng"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className="!h-[44px]"
            wrapClassName="flex-1"
            onChange={(e) => handleInputChange(e)} // Gọi hàm xử lý thay đổi
          />
        ) : (
          <CustomInput
            value={inputValue} // Gán giá trị input từ state
            placeholder="Tìm kiếm combo"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className="!h-[44px]"
            wrapClassName="flex-1"
            onChange={(e) => handleInputChange(e)} // Gọi hàm xử lý thay đổi
          />
        )}
      </Space.Compact>
      <div className="mt-[15px] h-[500px] overflow-y-auto">
        {selectedFilter === "product"
          ? products?.data?.content?.map((item) => (
              <div
                key={item?.id}
                className={`flex justify-between items-center p-3 border-b ${
                  selectedProductIds.includes(item.id) ? "bg-[#FFF4F0]" : ""
                }`}
              >
                <div className="flex gap-20">
                  <CustomCheckbox
                    checked={selectedProductIds.includes(item.id)}
                    onChange={(e) =>
                      handleCheckboxChange(item, e.target.checked)
                    }
                  />
                  <div className="flex items-center gap-5">
                    {isColorAvatar(item.avatarUrl) ? (
                      <div
                        className="w-[60px] h-[60px] rounded-lg"
                        style={{
                          backgroundColor: item.avatarUrl,
                        }}
                      />
                    ) : (
                      <Image
                        width={60}
                        height={60}
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
            ))
          : combos?.data?.content?.map((item) => (
              <div
                key={item?.id}
                className={`flex justify-between items-center p-3 border-b ${
                  selectedProductIds.includes(item.id) ? "bg-[#FFF4F0]" : ""
                }`}
              >
                <div className="flex gap-20">
                  <CustomCheckbox
                    checked={selectedProductIds.includes(item.id)}
                    onChange={(e) =>
                      handleCheckboxChange(item, e.target.checked)
                    }
                  />
                  <div className="flex items-center gap-5">
                    {isColorAvatar(item.avatarUrl) ? (
                      <div
                        className="w-[60px] h-[60px] rounded-lg"
                        style={{
                          backgroundColor: item.avatarUrl,
                        }}
                      />
                    ) : (
                      <Image
                        width={60}
                        height={60}
                        alt="combo"
                        src={item.avatarUrl || "/images/services1.png"}
                      />
                    )}
                    <p className="text-[#3355FF]">{item?.name}</p>
                  </div>
                </div>
                <p>{formatCurrency(item.price)}</p>
              </div>
            ))}
        <div ref={loadMoreRef} style={{ height: 1 }} />

        {loadingMore && (
          <div className="flex justify-center items-center mt-4">
            <Spin />
          </div>
        )}
      </div>
    </CustomModal>
  );
};

export default ModalProduct;

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

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <span>Mặt hàng 1</span>,
  },
  {
    key: "2",
    label: <span>Mạt hàng 2</span>,
  },
  {
    key: "3",
    label: <span>Mặt hàng 3</span>,
  },
];

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
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
    getValues("productIds") || []
  );
  const [selectedProductToShow, setSelectedProductToShow] = useState<number[]>(
    productToShow || []
  );
  const branch = useRecoilValue(branchStateSession);

  const [formFilterProduct, setFormFilterProduct] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    type: "",
    keyword: "",
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);

  const { data: products, isFetching } = useQuery(
    ["PRODUCT", formFilterProduct],
    async () => {
      const response = await getProducts(formFilterProduct);
      setTotalElements(response?.data?.totalElements || 0);
      return response;
    },
    {
      keepPreviousData: true,
    }
  );

  const handleFilterType = (filterType) => {
    setFormFilterProduct((prev) => ({
      ...prev,
      type: filterType,
    }));
  };

  const secondaryItems: MenuProps["items"] = [
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

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: any) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          !loadingMore &&
          !isFetching &&
          products?.data?.content?.length < totalElements // Kiểm tra tổng số phần tử
        ) {
          setLoadingMore(true);
          setFormFilterProduct((prev) => ({
            ...prev,
            limit: prev.limit + 20,
          }));
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadingMore, isFetching, products?.data?.content?.length, totalElements]);

  // Khi có dữ liệu mới, tắt trạng thái loadingMore
  useEffect(() => {
    if (!isFetching) setLoadingMore(false);
  }, [isFetching]);

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
        {/* <div className="border-[1px] px-[10px] flex items-center rounded-l-lg border-[#d9d9d9] border-r-0">
          <Dropdown menu={{ items: secondaryItems }}>
            <Space>
              <div className="flex items-center w-[200px] justify-between">
                <div className="flex items-center">
                  <Image src={FilterIcon} />
                  <span className=" mx-2 cursor-pointer">Lọc mặt hàng</span>
                </div>
                <Image src={DropIcon} />
              </div>
            </Space>
          </Dropdown>
        </div> */}

        <CustomInput
          placeholder="Tìm kiếm "
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className="!h-[44px]"
          wrapClassName="flex-1"
          onChange={debounce((value) => {
            setFormFilterProduct({
              ...formFilterProduct,
              keyword: value,
              page: 1,
            });
          }, 300)}
        />
      </Space.Compact>
      <div className="mt-[15px] h-[500px] overflow-y-auto">
        {products?.data?.content?.map((item) => (
          <div
            key={item?.id}
            className={`flex justify-between items-center p-3 border-b ${
              selectedProductIds.includes(item.id) ? "bg-[#FFF4F0]" : ""
            }`}
          >
            <div className="flex gap-20">
              <CustomCheckbox
                checked={selectedProductIds.includes(item.id)}
                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              />
              <div className="flex items-center gap-5">
                {isColorAvatar(item.avatarUrl) ? (
                  <div
                    className="w-[60px] h-[60px] rounded-lg"
                    style={{ backgroundColor: item.avatarUrl }}
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

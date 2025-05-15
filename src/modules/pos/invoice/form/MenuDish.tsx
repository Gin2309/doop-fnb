import Image from "next/image";
import ArrowLeft from "@/assets/ArrowLeft.svg";
import Search from "@/assets/searchIcon.svg";
import { useRouter } from "next/router";
import { CustomInput } from "@/components/CustomInput";
import { formatCurrency, isColorAvatar } from "@/utils";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/api/category.service";
import _debounce from "lodash/debounce";
import ModalMoreOption from "./components/ModalMoreOption";
import { CustomSelect } from "@/components/CustomSelect";
import { ModalInputPrice } from "./components/ModalInputPrice";

export default function MenuDish({
  data,
  formFilterProduct,
  setFormFilterProduct,
  productChoosing,
  setProductChoosing,
}) {
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);
  const [isOpenMoreOption, setIsOpenMoreOption] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);
  const [isOpenInputPrice, setIsOpenInputPrice] = useState(false);

  const [formFilterCategory, setFormFilterCategory] = useState({
    limit: 20,
    page: 1,
    branchId: branch?.id,
    status: undefined,
    role: "",
    keyword: "",
  });

  const { data: categories } = useQuery(["CATEGORY", formFilterCategory], () =>
    getCategory(formFilterCategory)
  );

  const handleChangeCategory = (value) => {
    setFormFilterProduct({
      ...formFilterProduct,
      categoryId: value,
    });
  };

  const handleSelectProduct = (item) => {
    if (
      item?.type === "TIME" ||
      item?.variants.length > 1 ||
      item?.productSelectionGroupDtos?.length > 0
    ) {
      setSelectProduct(item);
      setIsOpenMoreOption(true);
    } else if (
      item?.variants?.length === 1 &&
      item?.variants[0]?.isConfigPrice
    ) {
      setSelectProduct(item);
      setIsOpenInputPrice(true);
    } else {
      const newProduct = {
        productName: item?.name,
        productType: item?.type,
        variantId: item.variants[0].id || 0,
        variantName: item.variants[0]?.name,
        variantPrice: item.variants[0]?.price,
        itemPrice: item.variants[0]?.price,
        quantity: 1,
        groups: [],
      };

      const existingProductIndex = productChoosing.findIndex(
        (product) =>
          product.variantId === item.variants[0].id &&
          JSON.stringify(product.groups) === JSON.stringify(newProduct.groups)
      );

      if (existingProductIndex !== -1) {
        if (item.type !== "TIME") {
          const updatedProductChoosing = [...productChoosing];
          updatedProductChoosing[existingProductIndex].quantity += 1;
          setProductChoosing(updatedProductChoosing);
        }
      } else {
        setProductChoosing([...productChoosing, newProduct]);
      }
    }
  };

  return (
    <>
      <div>
        <div className="bg-white ">
          <div
            className="flex items-center gap-2 py-2 ml-4 cursor-pointer"
            onClick={() => router.push("/pos/invoice")}
          >
            <Image src={ArrowLeft} />
            <p>Quay lại danh sách hóa đơn</p>
          </div>
          <div className="grid grid-cols-2 items-center border-y">
            <div className="border-r mr-2">
              <CustomInput
                onChange={_debounce((value) => {
                  setFormFilterProduct((preValue) => ({
                    ...preValue,
                    keyword: value,
                  }));
                }, 300)}
                prefixIcon={<Image src={Search} />}
                placeholder="Tìm kiếm menu"
                className="border-none py-4 mx-2"
              />
            </div>
            <CustomSelect
              value={formFilterProduct?.categoryId || ""}
              options={[
                { value: "", label: "Tất cả" },
                ...(categories?.data?.content?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []),
              ]}
              onChange={(e) => handleChangeCategory(e)}
              className="!ml-0 !border-none"
              placeholder="Chọn danh mục"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-5">
          {data?.length > 0 ? (
            data?.map((item) => (
              <div
                className="flex justify-between items-center p-3 flex-col !bg-white cursor-pointer rounded-lg"
                key={item?.id}
                onClick={() => handleSelectProduct(item)}
              >
                {item?.avatarUrl ? (
                  isColorAvatar(item?.avatarUrl) ? (
                    <div
                      className="w-full h-[160px] rounded-lg"
                      style={{
                        backgroundColor: item?.avatarUrl,
                      }}
                    />
                  ) : (
                    <div className="w-full h-[160px] relative">
                      <Image
                        layout="fill"
                        className="rounded-lg object-cover object-center"
                        alt="cafe"
                        src={item?.avatarUrl || "/images/services1.png"}
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-[160px] rounded-lg bg-gray-200 flex justify-center items-center font-semibold">
                    {item.name.charAt(0)}
                  </div>
                )}

                <div className="flex flex-1 flex-col items-center justify-between">
                  <p className="font-semibold my-3">{item?.name}</p>
                  <div className="flex gap-2">
                    {/* <p className="line-through text-[#B2B2B2]">700,000 đ</p> */}
                    <p className="text-[#FF5C00] font-semibold">
                      {item?.variants?.length > 1
                        ? `${item?.variants?.length} giá`
                        : item?.variants[0]?.isConfigPrice
                        ? "Nhập giá"
                        : formatCurrency(item.variants[0]?.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Không có sản phẩm</div>
          )}
        </div>
      </div>
      {isOpenMoreOption && (
        <ModalMoreOption
          isOpen={isOpenMoreOption}
          onCancel={() => setIsOpenMoreOption(false)}
          selectProduct={selectProduct}
          setSelectProduct={setSelectProduct}
          productChoosing={productChoosing}
          setProductChoosing={setProductChoosing}
        />
      )}

      {isOpenInputPrice && (
        <ModalInputPrice
          isOpen={isOpenInputPrice}
          onCancel={() => setIsOpenInputPrice(false)}
          selectProduct={selectProduct}
          setSelectProduct={setSelectProduct}
          productChoosing={productChoosing}
          setProductChoosing={setProductChoosing}
        />
      )}
    </>
  );
}

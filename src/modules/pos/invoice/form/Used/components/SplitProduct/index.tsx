import { formatCurrency } from "@/utils";
import { CustomInput } from "@/components/CustomInput";
import { useEffect, useState } from "react";
import { CustomCheckbox } from "@/components/CustomCheckbox";

export default function SplitProduct({
  style,
  data,
  productSplitChecked,
  setProductSplitChecked,
}: {
  style?: any;
  data: any;
  productSplitChecked: any;
  setProductSplitChecked: any;
}) {
  const [productSplit, setProductSplit] = useState([]);

  useEffect(() => {
    const dataSplit = data?.currentBill?.currentBillItems?.map((item) => ({
      id: item.id,
      productName: item?.product?.name,
      variantId: item?.variant?.id || 0,
      variantName: item?.variant?.name,
      variantPrice: item?.variant?.price,
      itemPrice: item?.itemPrice,
      quantity: item?.quantity,
      originalQuantity: item?.quantity,
      groups: item?.openSelects?.map((item) => ({
        selectionId: item?.selection?.id,
        price: item?.selection?.price,
        quantity: item.quantity,
      })),
    }));

    setProductSplit(dataSplit);
  }, [data]);

  const handleCheckboxChange = (item) => {
    setProductSplitChecked((prevCheckedItems) => {
      const isChecked = prevCheckedItems.some(
        (checkedItem) => checkedItem.id === item.id
      );

      if (isChecked) {
        return prevCheckedItems.filter(
          (checkedItem) => checkedItem.id !== item.id
        );
      } else {
        return [...prevCheckedItems, item];
      }
    });
  };

  const handleDecreaseQuantity = (variantId) => {
    setProductSplitChecked((prevCheckedItems) => {
      return prevCheckedItems.map((item) => {
        if (item.variantId === variantId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  };

  const handleIncreaseQuantity = (variantId, originalQuantity) => {
    setProductSplitChecked((prevCheckedItems) => {
      return prevCheckedItems.map((item) => {
        if (item.variantId === variantId && item.quantity < originalQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    setProductSplitChecked((prevCheckedItems) => {
      return prevCheckedItems.map((item) => {
        if (item.variantId === variantId) {
          const validQuantity = Math.min(
            Math.max(newQuantity, 1),
            item.originalQuantity
          );
          return { ...item, quantity: validQuantity };
        }
        return item;
      });
    });
  };

  return (
    <div className="flex flex-col overflow-auto " style={style}>
      {productSplit?.map((item: any) => {
        const checkedItem = productSplitChecked.find(
          (checkedItem) => checkedItem.id === item.id
        );

        let quantity = 1;

        if (checkedItem) {
          quantity = checkedItem?.quantity;
        } else {
          quantity = item?.quantity;
        }

        const totalPrice =
          item?.itemPrice * quantity +
          item.groups.reduce(
            (acc, group) => acc + group.price * group.quantity,
            0
          );

        return (
          <div
            key={item.id}
            className="flex gap-2 justify-between p-2 border-b border-dashed"
          >
            <div className="flex items-start gap-3">
              <CustomCheckbox
                className="translate-y-[5px]"
                checked={productSplitChecked.some(
                  (checkedItem) => checkedItem.id === item.id
                )}
                onChange={() => handleCheckboxChange(item)}
              />

              <div className="flex flex-col gap-1 ">
                <p className="text-lg font-bold">{item.productName}</p>
                <p className="text-[#666666] ">{item.variantName}</p>
              </div>
            </div>
            <div className="flex  gap-5">
              <div className="flex flex-col gap-2 items-end">
                <p className="text-lg font-bold">
                  {formatCurrency(totalPrice)}
                </p>
                {item.productType !== "TIME" && (
                  <div className="flex gap-5 items-center">
                    {item.quantity !== 1 && (
                      <div
                        onClick={() => handleDecreaseQuantity(item.variantId)}
                        className={`flex justify-center items-center text-xl rounded-full border-[1px] w-[32px] h-[32px]  ${
                          item.quantity < 2
                            ? " border-[#B2B2B2] text-[#B2B2B2]  cursor-not-allowed"
                            : "border-[#E50000] text-[#E50000] cursor-pointer  "
                        }`}
                      >
                        -
                      </div>
                    )}
                    <CustomInput
                      type="number"
                      value={
                        checkedItem ? checkedItem?.quantity : item?.quantity
                      }
                      onChange={(e) =>
                        handleQuantityChange(item.variantId, parseInt(e, 10))
                      }
                      className="text-xl w-[70px] border-none text-center"
                    />

                    {item.quantity !== 1 && (
                      <div
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.variantId,
                            item.originalQuantity
                          )
                        }
                        className={`flex justify-center items-center text-xl rounded-full border-[1px] w-[32px] h-[32px]  ${
                          checkedItem &&
                          checkedItem?.quantity !== item.originalQuantity
                            ? " border-[#3355FF] text-[#3355FF] cursor-pointer"
                            : "border-[#B2B2B2] text-[#B2B2B2]  cursor-not-allowed   "
                        }`}
                      >
                        +
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

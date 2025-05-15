import BankAccount from "@/shared/models/BankAccount";
import KDSItem from "@/shared/models/KDSItem";
import OpenSelect from "@/shared/models/OpenSelect";
import { formatCurrency, numberToWords, formatTime2 } from "@/utils";
import { Image } from "antd";
import { useMemo } from "react";

function capitalizeFirstLetter(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

type SaleInvoiceProps = {
  data: any,
  totalBill: any,
  received?: number,
  excess?: number;
  isTemporary?: boolean;
  bankAccounts?: BankAccount[]
}
export default function SaleInvoice(props: SaleInvoiceProps) {
  const {
    data,
    totalBill,
    received = 0,
    excess = 0,
    isTemporary = false,
    bankAccounts = []
  } = props
  const discountValue = totalBill.discount + totalBill.voucher;

  const getOpenSelectKey = (select: OpenSelect) => `${select.quantity}-${select.selection?.id ?? "null"}`;

  const billItems = useMemo(() => {
    const items: KDSItem[] = data?.currentBill?.currentBillItems || [];
    return items.reduce((arr, item, index) => {
      const existItem = [...arr].find((eItem) => {
        if (item.product?.productType === "QUANTITY") {
          if (eItem.product?.id !== item.product?.id) return false;
          if (eItem.variant?.id !== item.variant?.id) return false;
          if (eItem.openSelects?.length !== item.openSelects?.length) return false;
          const set1 = new Set(eItem.openSelects.map(getOpenSelectKey));
          const set2 = new Set(item.openSelects.map(getOpenSelectKey));
          return set1.size === set2.size && Array.from(set1).every((key) => set2.has(key));
        } else {
          // TODO: Other product type
          return false;
        }
      });
      if (!existItem) arr.push(item);
      else {
        const newGroupKDSItem = new KDSItem({
          ...item,
          quantity: item.quantity + existItem.quantity,
        });
        if (existItem) {
          const index = arr.indexOf(existItem);
          arr[index] = newGroupKDSItem;
        } else {
          arr.push(newGroupKDSItem);
        }
      }
      return arr;
    }, [] as KDSItem[]);
  }, [data?.currentBill?.currentBillItems]);

  return (
    <div className="p-5 border max-w-md mx-auto text-sm font-sans h-screen overflow-y-scroll hidden-scroll">
      <div className="text-center">
        <h1 className="font-bold text-lg">Logo/ Tên quán</h1>
        <p>Địa chỉ: 32 Đỗ Đức Dục, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội</p>
        <p>Điện thoại: 0123456789</p>
        <h2 className="font-bold mt-4 text-lg">
          {isTemporary ? "HÓA ĐƠN TẠM TÍNH" : "HÓA ĐƠN BÁN HÀNG"}
        </h2>
      </div>
      <div className="mt-4">
        <div className="text-center">
          <p>Số HĐ: 123456</p>
          <p>Thu ngân: Lan Anh</p>
          <p>{formatTime2(data?.receptionTime)} - 16:02 14/09/2024</p>
        </div>
        <p>Khách hàng: {data?.currentBill?.customerName}</p>
        <p>SDT: </p>
        <p>Địa chỉ: </p>
      </div>
      <div className="mt-4 ">
        <div className="grid grid-cols-5 border-y-[2px] border-[#666666] py-1">
          <p className="col-span-3 font-bold ">Đơn giá</p>
          <div className="flex justify-between col-span-2 font-bold">
            <p>SL</p>
            <p>Thành tiền</p>
          </div>
        </div>

        {billItems.map((item) => {
          return (
            <div className="py-1 border-dashed border-b" key={item?.id}>
              <p className="font-bold ">{item?.product?.name}
                {!!item?.variant && ` (${item?.variant?.name})`}
              </p>
              <div className="grid grid-cols-5 ">
                <div className="col-span-3 ">
                  {item?.product?.productType === "TIME" ? (
                    <p>{formatCurrency(item?.itemPrice)}</p>
                  ) : (
                    <p>{formatCurrency(item?.variant!.price)}</p>
                  )}
                </div>

                <div className="flex items-end justify-between col-span-2 ">
                  <p>{item?.quantity}</p>
                  {item?.product?.productType === "TIME" ? (
                    <p>{formatCurrency(item?.finalPrice)}</p>
                  ) : (
                    <p>
                      {formatCurrency(item?.quantity * item?.variant!.price)}
                    </p>
                  )}
                </div>
              </div>

              {item?.openSelects?.map((group) => (
                <div className="grid grid-cols-5 ">
                  <div className="col-span-3 ">
                    <p>
                      {" "}
                      {group.selection!.name} (
                      {formatCurrency(group.selection!.price)})
                    </p>
                  </div>

                  <div className="flex items-end justify-between col-span-2 ">
                    <p>{group.quantity}{item.quantity > 1 ? `(x${item.quantity})` : ''}</p>
                    <p>
                      {formatCurrency(group.selection!.price * group.quantity * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-4  pt-2">
        <div className="grid grid-cols-5 font-semibold">
          <span className="col-span-3 flex justify-end">Tổng tiền hàng:</span>
          <span className="col-span-2 flex justify-end">
            {formatCurrency(totalBill?.subtotal)}
          </span>
        </div>
        <div className="grid grid-cols-5 font-semibold">
          <span className="col-span-3 flex justify-end">Chiết khấu:</span>
          <span className="col-span-2 flex justify-end">
            {discountValue > 0
              ? `- ${formatCurrency(discountValue)}`
              : formatCurrency(0)}
          </span>
        </div>
        <div className="grid grid-cols-5 font-semibold">
          <span className="col-span-3 flex justify-end">Tổng thanh toán:</span>
          <span className="col-span-2 flex justify-end">
            {formatCurrency(totalBill?.total)}
          </span>
        </div>
        <div className="grid grid-cols-5 font-semibold">
          <span className="col-span-3 flex justify-end">Tiền khách đưa:</span>
          <span className="col-span-2 flex justify-end">
            {received > 0 ? formatCurrency(received) : "---"}
          </span>
        </div>
        <div className="grid grid-cols-5 font-semibold">
          <span className="col-span-3 flex justify-end">Tiền thừa:</span>
          <span className="col-span-2 flex justify-end">
            {excess > 0 ? formatCurrency(excess) : "---"}
          </span>
        </div>
        <p className="text-center mt-4">
          (<i>{capitalizeFirstLetter(numberToWords(totalBill?.total))}</i>)
        </p>
      </div>
      <div className="mt-4 text-center">
        {bankAccounts.map((acc) => {
          const url = `https://img.vietqr.io/image/${acc.bankId}-${acc.accountNo}-qr_only.png`;
          return <div className="flex items-center gap-3 justify-center" key={acc._id}>
            <Image
              src={url}
              alt={acc.bankName}
              width={80}
              height={80}
            />
          </div>
        })}
        {/* <div className="bg-gray-200 h-24 w-24 mx-auto">QR Code</div> */}
      </div>

      <div className="text-center mt-5">
        <p>Cảm ơn và hẹn gặp lại</p>
        <p className="italic">Powered by Doop.vn</p>
      </div>
    </div>
  );
}

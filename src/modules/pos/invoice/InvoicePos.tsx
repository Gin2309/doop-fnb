import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { DatePicker } from "antd";
import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import { CustomSelect } from "@/components/CustomSelect";
import InvoicePosContent from "./InvoicePosContent";
import { formatMoney } from "@/helpers";

import PlusIcon from "@/assets/PlusIconWhite.svg";
import Printer from "@/assets/Printer.svg";
import Download from "@/assets/GreenDowload.svg";
import ArrowDownIcon from "@/assets/arrowDownIcon.svg";
import IconoirFilter from "@/assets/iconoir_filter.svg";
import searchIcon from "@/assets/searchIcon.svg";
import bluePercent from "@/assets/bluePercent.svg";
import { CustomInput } from "@/components/CustomInput";

const { RangePicker } = DatePicker;

export default function InvoicePos({
  data,
  setFormFilter,
  formFilter,
  isLoading,
  setData,
  isLoading2,
  keyData,
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const calculateTotalBill = (currentBill) => {
    if (!currentBill || !currentBill.currentBillItems) {
      return {
        subtotal: 0,
        discount: 0,
        tax: 0,
        voucher: 0,
        total: 0,
      };
    }

    const {
      currentBillItems,
      discountValue,
      discountPercent,
      taxValue,
      taxPercent,
      voucherValue,
      voucherPercent,
    } = currentBill;

    const subtotal = currentBillItems.reduce((total, item) => {
      const productTotal =
        item.variant.price * item.quantity +
        item.openSelects.reduce(
          (acc, group) => acc + group.selection.price * group.quantity,
          0
        );
      return total + productTotal;
    }, 0);

    const discount =
      discountValue ??
      (discountPercent ? (subtotal * discountPercent) / 100 : 0);
    const tax =
      taxValue ?? (taxPercent ? ((subtotal - discount) * taxPercent) / 100 : 0);
    const voucher =
      voucherValue ??
      (voucherPercent ? ((subtotal - discount) * voucherPercent) / 100 : 0);
    const total = subtotal - discount + tax - voucher;

    return { subtotal, discount, tax, voucher, total };
  };

  const totalBills = (data?.content || []).map((item) =>
    calculateTotalBill(item)
  );

  const totalBillsCount = data?.content?.length || 0;
  const grandTotal = data?.content?.reduce(
    (sum, bill) =>
      sum + (keyData === "current" ? bill.price || 0 : bill.totalPrice || 0),
    0
  );

  const handleSearch = (value: string) => {
    setFormFilter((prev: any) => ({
      ...prev,
      keyword: value,
    }));
  };

  return (
    <div className="p-5 ">
      <div>
        <Title>allInvoices</Title>

        <div className="text-[#1A1A1A] font-semibold mb-4">
          Tổng hóa đơn:{" "}
          <span className="text-[#3355FF]">{totalBillsCount}</span>/Tổng tiền:{" "}
          <span className="text-[#009933] font-semibold">
            {formatMoney(grandTotal)}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between flex-wrap mb-6 gap-4">
          <div className="flex gap-3">
            <div>
              <CustomInput
                onChange={(value: any) => handleSearch(value)}
                placeholder="Tìm kiếm"
                className="border-[1px] rounded-lg border-[#b2b2b2] h-12 w-[272px]"
                prefix={
                  <Image src={searchIcon} alt="" height={24} width={24} />
                }
              />
            </div>

            <div className="flex flex-wrap items-center bg-white rounded-[8px] border-[1px] border-[#B2B2B2]">
              <RangePicker
                bordered={false}
                placeholder={[t("fromDate"), t("toDate")]}
                suffixIcon={<Image src={ArrowDownIcon} />}
                className="w-[283px]"
                format="DD/MM/YYYY"
              />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <CustomButton
              type="download-btn"
              prefixIcon={<Image src={Download} />}
            >
              {t("download")}
            </CustomButton>
            <CustomButton type="print-btn" prefixIcon={<Image src={Printer} />}>
              {t("printList")}
            </CustomButton>
          </div>
        </div>

        <InvoicePosContent
          data={data}
          setFormFilter={setFormFilter}
          formFilter={formFilter}
          isLoading={isLoading}
          isLoading2={isLoading2}
          setData={setData}
          keyData={keyData}
        />
      </div>
    </div>
  );
}

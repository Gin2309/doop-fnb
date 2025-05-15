import { useState, useRef } from "react";
import { Popover } from "antd";
import { useReactToPrint } from "react-to-print";

import Image from "next/image";

import { formatCurrency } from "@/utils";
import { EPositionAction } from "@/enums";
import { CustomButton } from "@/components/CustomButton";
import ListProductUse from "./components/ListProductUse";
import SplitProduct from "./components/SplitProduct";
import VoucherModal from "./components/VoucherModal";
import ModalCancelBill from "../../components/ModalCancel";
import SaleInvoice from "../Bill/SaleInvoice";

import FileX from "@/assets/FileX.svg";
import Cursor from "@/assets/Cursor.svg";
import ArrowsInLineHorizontal from "@/assets/ArrowsInLineHorizontal.svg";
import ArrowsOutLineHorizontal from "@/assets/ArrowsOutLineHorizontal.svg";
import CaretDoubleDown from "@/assets/CaretDoubleDown.svg";
import Dish from "@/assets/Dish3.svg";
import TagBlue from "@/assets/TagBlue.svg";
import BoxGift from "@/assets/BoxGift.svg";
import Percent from "@/assets/Percent.svg";
import DiscountModal from "./components/DiscountModal";

export default function Used({
  data,
  setOpenListPosition,
  setTypePosition,
  productSplitChecked,
  setProductSplitChecked,
  handleOpenSplit,
  openBill,
  totalBill,
  refetch,
  setTransferItem,
  setOpenTransferItem,
  bankAccounts
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [openCancelPosition, setOpenCancelPositon] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);

  const handleOpenVoucher = () => {
    setOpen(true);
    setOpenPopover(false);
  };
  const handleOpenDiscount = () => {
    setOpenDiscount(true);
    setOpenPopover(false);
  };

  const contentPopover = (
    <div className="grid grid-cols-2 gap-1" style={{ width: 425 }}>
      <div className="flex gap-4 items-start bg-[#F5F6FF] p-3 h-[68px]">
        <Image src={Dish} />
        <div>
          <p>Tiền hàng ({data?.currentBill?.currentBillItems.length || 0})</p>
          <p className="font-semibold">+{formatCurrency(totalBill.total)}</p>
        </div>
      </div>
      <div
        onClick={handleOpenVoucher}
        className={`flex gap-4 h-[68px] ${totalBill.voucher > 0 ? "items-start" : "items-center"
          } items-start bg-[#F5F6FF] p-3 cursor-pointer`}
      >
        <Image src={BoxGift} />
        <div>
          <p>Khuyến mại</p>
          <p className="font-semibold">
            {totalBill.voucher > 0 && `-${formatCurrency(totalBill.voucher)}`}
          </p>
        </div>
      </div>
      <div
        className={`flex gap-4 h-[68px]  ${totalBill.tax > 0 ? "items-start" : "items-center"
          } bg-[#F5F6FF] p-3`}
      >
        <Image src={TagBlue} />
        <div>
          <p>Thuế phí</p>
          <p className="font-semibold">
            {totalBill.tax > 0 && `+${formatCurrency(totalBill.tax)}`}
          </p>
        </div>
      </div>
      <div
        onClick={handleOpenDiscount}
        className={`flex gap-4 h-[68px]  ${totalBill.discount > 0 ? "items-start" : "items-center"
          } bg-[#F5F6FF] p-3 cursor-pointer`}
      >
        <Image src={Percent} />
        <div>
          <p>Chiết khấu</p>
          <p className="font-semibold">
            {totalBill.discount > 0 && `-${formatCurrency(totalBill.discount)}`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden">
        <div ref={contentRef}>
          <SaleInvoice data={data} totalBill={totalBill} isTemporary={true} bankAccounts={bankAccounts} />
        </div>
      </div>

      <div className="flex-1 pb-[170px]">
        {splitMode ? (
          <SplitProduct
            data={data}
            productSplitChecked={productSplitChecked}
            setProductSplitChecked={setProductSplitChecked}
          />
        ) : (
          <ListProductUse
            data={data}
            refetch={refetch}
            setTransferItem={setTransferItem}
            setOpenTransferItem={setOpenTransferItem}
          />
        )}
      </div>

      <div className="border-t p-2 bg-white absolute bottom-0 w-[419px]">
        <div className="absolute cursor-pointer right-[46%] top-[-10%] bg-[#F5F6FF] border-[1px] rounded-full h-8 w-8 flex items-center justify-center">
          <Popover
            content={contentPopover}
            title={null}
            trigger="click"
            open={openPopover}
            onOpenChange={(open) => setOpenPopover(open)}
            placement="top"
          >
            <Image src={CaretDoubleDown} alt="Toggle Icon" />
          </Popover>
        </div>
        <div className="flex justify-between py-3">
          <p className="text-base font-semibold text-[#333333]">TỔNG TIỀN</p>
          <div className="flex gap-3 items-center">
            <p className="text-base font-semibold text-[#FF5C00]">
              {formatCurrency(totalBill.total)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 py-2">
          <CustomButton
            type="gray"
            wrapClassName="flex-grow "
            className="!rounded-full !px-1"
            prefixIcon={
              <Image width={24} height={24} src={ArrowsOutLineHorizontal} />
            }
            onClick={() => {
              setSplitMode(true);
              setTypePosition(EPositionAction.SPLIT);
            }}
          >
            Tách
          </CustomButton>
          <CustomButton
            type="gray"
            wrapClassName="flex-grow "
            className="!rounded-full !px-1"
            prefixIcon={<Image src={ArrowsInLineHorizontal} />}
            onClick={() => {
              setOpenListPosition(true);
              setTypePosition(EPositionAction.MERGE);
            }}
          >
            Gộp
          </CustomButton>
          <CustomButton
            type="gray"
            wrapClassName="flex-grow "
            className="!rounded-full !px-1"
            prefixIcon={<Image src={FileX} />}
            onClick={() => setOpenCancelPositon(true)}
          >
            Hủy
          </CustomButton>
          <CustomButton
            type="gray"
            wrapClassName="flex-grow text-[12px]"
            className="!rounded-full !px-1"
            prefixIcon={<Image src={Cursor} />}
            onClick={() => {
              setOpenListPosition(true);
              setTypePosition(EPositionAction.TRANSFER);
            }}
          >
            Di chuyển bàn
          </CustomButton>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {splitMode ? (
            <>
              <CustomButton
                type="border-color"
                className="!rounded-lg !border-[#E50000] w-full"
                onClick={() => setSplitMode(false)}
              >
                Huỷ
              </CustomButton>
              <CustomButton
                type="primary"
                className="!rounded-lg w-full"
                onClick={handleOpenSplit}
              >
                Tách hóa đơn
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton
                onClick={reactToPrintFn}
                type="green-btn"
                className="!rounded-lg w-full"
              >
                In tạm tính
              </CustomButton>
              <CustomButton
                type="primary"
                className="!rounded-lg  w-full"
                onClick={openBill}
              >
                Thanh toán
              </CustomButton>
            </>
          )}
        </div>
      </div>

      <VoucherModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        currentBillId={data?.currentBill?.id}
        refetch={refetch}
      />

      <DiscountModal
        isOpen={openDiscount}
        onCancel={() => setOpenDiscount(false)}
        currentBillId={data?.currentBill?.id}
        refetch={refetch}
      />

      <ModalCancelBill
        isOpen={openCancelPosition}
        onCancel={() => setOpenCancelPositon(false)}
        id={data?.currentBill?.id}
        type="BILL"
      />
    </>
  );
}

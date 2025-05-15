import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

import { Drawer, message } from "antd";
import { formatCurrency } from "@/utils";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import SaleInvoice from "./SaleInvoice";
import Label from "@/components/CustomLabel";
import ModalWarn from "@/components/CustomModal/ModalWarn";
import { customMessage } from "@/utils/messageHelper";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBillPayment } from "@/api/bill-pos.service";
import { Controller, useForm } from "react-hook-form";

import XIcon from "@/assets/X.svg";
import PersonIcon from "@/assets/User.svg";
import CreditCard from "@/assets/CreditCard.svg";
import PrintIcon from "@/assets/Printer.svg";
import QrCodePos from "@/assets/QrCodePos.svg";
import MoneyPos from "@/assets/MoneyPos.svg";
import qr from "@/assets/image 83.png";
import BankAccount from "@/shared/models/BankAccount";

type BillProps = {
  open: boolean;
  onClose?: () => void;
  data: any;
  totalBill: any;
  bankAccounts?: BankAccount[];
}
export default function Bill(props: BillProps) {
  const { open, onClose, data, totalBill, bankAccounts } = props
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const queryClient = useQueryClient();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [openModalWarn, setOpenModalWarn] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { mutate: mutate } = useMutation(
    (data: any) => {
      return createBillPayment(data);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["AREA"]);
        customMessage.success("Thanh toán thành công");
        reset();
        router.back();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = (dataForm) => {
    const dataMutate = {
      ...dataForm,
      paymentMethod: paymentMethod,
      positionId: data?.position?.id,
      customerPaid: 0,
    };

    mutate(dataMutate);
  };

  // Tính điểm
  const configPoint = 470;
  const [point, setPoint] = useState<number>(0);
  const [pointToMoney, setPointToMoney] = useState<number>(0);

  // Tính tiền khách trả
  const total = totalBill.total;
  const [deposit, setDeposit] = useState<number>(0);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [received, setReceived] = useState<number>(0);
  const [excess, setExcess] = useState<number>(0);

  useEffect(() => {
    // Tính điểm thành tiền
    const pointConversionRate = configPoint / 1000;
    const newPointToMoney = point * pointConversionRate;
    const adjustedPointToMoney = Math.max(
      parseFloat(newPointToMoney.toFixed(0)),
      0
    );

    setPointToMoney(adjustedPointToMoney);

    // Tính tiền khách trả
    const newAmountToPay = total - deposit - adjustedPointToMoney;
    setAmountToPay(parseFloat(newAmountToPay.toFixed(0)));

    // Tính tiền thừa nếu có
    const newExcess = received - newAmountToPay;
    setExcess(newExcess > 0 ? newExcess : 0);
  }, [deposit, received, total, point]);

  return (
    <>
      <Drawer onClose={onClose} open={open} placement="right" width={950}>
        <div className="flex">
          <div ref={contentRef}>
            <SaleInvoice
              data={data}
              totalBill={totalBill}
              excess={excess}
              received={received}
              bankAccounts={bankAccounts}
            />
          </div>
          <div className="border-l !w-[536px] h-screen overflow-y-scroll">
            <div className="flex justify-between items-start p-5 border-b">
              <div>
                <p className="text-xl font-bold">Thanh toán hóa đơn</p>
                <p className="text-[#828487]">Đơn #{data?.currentBill?.code}</p>
              </div>
              <div className="cursor-pointer" onClick={onClose}>
                <Image src={XIcon} />
              </div>
            </div>

            <div className="p-5 ">
              <div className="p-4 bg-[#F8F9FD] rounded-lg">
                <div className="flex gap-2 items-center border-[1px] p-2 rounded-full bg-white">
                  <Image src={PersonIcon} />
                  <span>{data?.currentBill?.customerName}</span>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Tổng tiền</p>
                    <p className="text-2xl font-bold border-b text-end">
                      {formatCurrency(total)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Đổi điểm</p>
                    <div className="flex items-center bg-white border-b-2 p-2">
                      <CustomInput
                        value={point}
                        type="number"
                        className="border-none rounded-none !text-end !p-0 text-black"
                        onChange={(value: any) => setPoint(value)}
                      />
                      <div className="h-full flex justify-center items-center ml-1 text-[#B2B2B2]">
                        /{configPoint}{" "}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center py-2">
                    <p className="text-[#666666] italic">Điểm quy đổi</p>
                    <p className="border-b text-end text-lg">
                      {formatCurrency(pointToMoney)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Khách đã cọc</p>
                    <div className="flex items-center bg-white border-b-2 p-2">
                      <CustomInput
                        value={deposit}
                        type="number"
                        wrapClassName="flex-1"
                        className="border-none rounded-none !text-end !p-0 text-black flex-1"
                        onChange={(value: any) => setDeposit(value)}
                      />
                      <div className="h-full flex justify-center items-center ml-1 text-[#B2B2B2]">
                        đ
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Khách cần trả</p>
                    <div className="flex items-center bg-white border-b-2 p-2">
                      <CustomInput
                        value={amountToPay}
                        type="number"
                        wrapClassName="flex-1"
                        className="border-none rounded-none !text-end !p-0 text-black flex-1 !bg-white !font-normal"
                        onChange={() => { }}
                        disabled
                      />
                      <div className="h-full flex justify-center items-center ml-1 text-[#B2B2B2]">
                        đ
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Đã nhận</p>
                    <div className="flex items-center bg-white border-b-2 p-2">
                      <CustomInput
                        value={received}
                        type="number"
                        wrapClassName="flex-1"
                        className="border-none rounded-none !text-end !p-0 text-black flex-1"
                        onChange={(value: any) => setReceived(value)}
                      />
                      <div className="h-full flex justify-center items-center ml-1 text-[#B2B2B2]">
                        đ
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 items-center">
                    <p className="text-[#333333]">Tiền thừa</p>
                    <div className="flex items-center bg-white border-b-2 p-2">
                      <CustomInput
                        value={excess}
                        type="number"
                        wrapClassName="flex-1"
                        className="border-none rounded-none !text-end !p-0 text-black flex-1 cursor-none !bg-white !font-normal"
                        onChange={() => { }}
                        disabled
                      />
                      <div className="h-full flex justify-center items-center ml-1 text-[#B2B2B2]">
                        đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2  mt-3">
                <Controller
                  name={`isVat`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <CustomCheckbox
                        {...field}
                        checked={field.value}
                        className="translate-y-[-5px] font-bold"
                      >
                        Yêu cầu xuất hóa đơn VAT
                      </CustomCheckbox>
                    );
                  }}
                />

                <Controller
                  name={`isZalo`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <CustomCheckbox
                        {...field}
                        checked={field.value}
                        className="translate-y-[-5px]"
                      >
                        <span className="font-bold">Gửi hóa đơn qua zalo</span>{" "}
                        (SĐT: <span className="text-[#3355FF]">0123456789</span>
                        )
                      </CustomCheckbox>
                    );
                  }}
                />
              </div>

              <div className="my-3">
                <p className="text-md font-semibold">Phương thức thanh toán</p>
                <div className="grid grid-cols-3 my-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod("CASH")}
                    className={`p-3 rounded-lg text-center border-[1px] cursor-pointer ${paymentMethod === "CASH"
                      ? "border-[#FF5C00]"
                      : "border-[#E4E4E4]"
                      }`}
                  >
                    <Image src={MoneyPos} />
                    <p>Tiền mặt</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("BANK")}
                    className={`p-3 rounded-lg text-center border-[1px] cursor-pointer ${paymentMethod === "TRANSFER"
                      ? "border-[#FF5C00]"
                      : "border-[#E4E4E4]"
                      }`}
                  >
                    <Image src={QrCodePos} />
                    <p>Chuyển khoản</p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-3 rounded-lg text-center border-[1px] cursor-pointer ${paymentMethod === "CARD"
                      ? "border-[#FF5C00]"
                      : "border-[#E4E4E4]"
                      }`}
                  >
                    <Image src={CreditCard} />
                    <p>Quẹt thẻ</p>
                  </div>
                </div>

                {paymentMethod === "BANK" && (
                  <div className="my-5">
                    <Image src={qr} />
                  </div>
                )}
              </div>

              <Controller
                name="note"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div>
                    <Label infoText="" label="Note" />
                    <CustomInput
                      {...field}
                      className="suffix-icon h-11 !rounded"
                      placeholder="Nhập ghi chú"
                    />
                  </div>
                )}
              />

              <div className="flex gap-2 mt-5">
                <CustomButton
                  type="icon"
                  onClick={reactToPrintFn}
                  className="!rounded-lg !border-[#FF5C00]"
                >
                  <Image src={PrintIcon} />
                </CustomButton>
                <CustomButton
                  type="primary"
                  wrapClassName="flex-grow"
                  className="!rounded-lg"
                  onClick={() => setOpenModalWarn(true)}
                >
                  Thanh toán
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {openModalWarn && (
        <ModalWarn
          title="Xác nhận thanh toán"
          content="Bạn có chắc chắn muốn thanh toán"
          isOpen={openModalWarn}
          onCancel={() => setOpenModalWarn(false)}
          onSuccess={handleSubmit(onSubmit)}
        />
      )}
    </>
  );
}

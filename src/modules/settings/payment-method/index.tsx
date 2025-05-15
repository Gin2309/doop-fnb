import React, { useState } from "react";
import Image from "next/image";

import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { CustomSwitch } from "@/components/CustomSwitch";
import AddPayment from "./AddPayment";

import TCB from "@/assets/TCB.png";
import OCB from "@/assets/OCB.png";
import MBB from "@/assets/MBB.png";
import VNP from "@/assets/VNP.png";
import ZLP from "@/assets/ZLP.png";
import mPos from "@/assets/mPos.png";
import KBB from "@/assets/KBB.png";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import CreditCard from "@/assets/CreditCard.svg";
import QrCodePos from "@/assets/QrCodePos.svg";
import MoneyPos from "@/assets/MoneyPos.svg";
import Visa from "@/assets/Visa.png";
import MasterCard from "@/assets/MasterCard.png";
import JCB from "@/assets/JCB.png";
import Momo from "@/assets/Momo.png";
import PaymentInfoList from "./PaymentInfoList";

const data = [
  {
    id: 1,
    img: MoneyPos,
    name: "Tiền mặt",
    type: "Tiền mặt",
  },
  {
    id: 2,
    img: QrCodePos,
    name: "Chuyển khoản",
    type: "Chuyển khoản",
  },
  {
    id: 3,
    img: CreditCard,
    name: "Thẻ ATM",
    type: "Thanh toán thẻ",
  },
  {
    id: 4,
    img: Visa,
    name: "Thẻ Visa",
    type: "Thanh toán thẻ",
  },
  {
    id: 5,
    img: MasterCard,
    name: "Thẻ MasterCard",
    type: "Thanh toán thẻ",
  },
  {
    id: 6,
    img: JCB,
    name: "Thẻ JCB",
    type: "Thanh toán thẻ",
  },
  {
    id: 7,
    img: Momo,
    name: "MoMo",
    type: "Ví điện tử",
  },
];

const columns: any = [
  {
    dataIndex: "img",
    align: "center",
    width: "180px",
    render: (value: string) => (value ? <Image src={value} /> : ""),
  },
  {
    title: "Tên phương thức",
    dataIndex: "name",
  },
  {
    title: "Loại phương thức",
    dataIndex: "type",
  },
  {
    dataIndex: "action",
    render: (_, record: any) => <CustomSwitch />,
  },
];

const PaymentSetup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CustomActionHeader
        title="paymentInfo"
        type="title"
      />
      <PaymentInfoList />

      <CustomActionHeader
        title="paymentMethod"
        type="save"
        onSubmit={() => { }}
      />

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase">
          Danh sách phương thức thanh toán
        </h1>
        <p className="text-[#666666] font-medium">
          Cho phép thêm, sửa, xóa, cập nhật thông tin tài khoản. Điều chỉnh thứ
          tự của các phương thức thanh toán để thể hiện trên ứng dụng bán hàng.
        </p>
        <p className="text-[#666666] font-medium">
          Đã sử dụng 5/5 phương thức thanh toán
        </p>
      </div>

      <div className="card mb-6 gap-5 flex flex-col">
        <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase">
          Thanh toán tích hợp
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={TCB} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">
                Techcombank VietQR Pro
              </h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối Techcombank VietQR Pro
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={OCB} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">OCB VietQR</h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối OCB VietQR{" "}
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={MBB} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">MBBank VietQR Pro</h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối MBBank VietQR Pro
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={VNP} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">VNPAY-QR</h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối VNPAY-QR
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={ZLP} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">ZaloPay</h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối ZaloPay
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={mPos} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">Máy quẹt thẻ mPOS</h1>
              <h2 className="text-[#666666]">
                Nhà hàng của bạn chưa kết nối máy quẹt thẻ mPOS
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Image src={KBB} alt="TCB" height={60} width={180} />
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1a1a1a] font-medium">KBank tính tiền</h1>
              <h2 className="text-[#666666]">
                Giải pháp chấp nhận thanh toán thẻ và QR thuận tiện, bảo mật.
              </h2>
            </div>
          </div>

          <CustomButton type="primary" onClick={() => { }} className="w-[100px]">
            Kết nối
          </CustomButton>
        </div>
      </div>

      <div className="card mb-6 gap-5 flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase">
            Thanh toán tích hợp
          </h1>

          <CustomButton
            type="primary"
            onClick={() => setIsOpen(true)}
            prefixIcon={<Image src={PlusIcon} />}
          >
            Thêm phương thức thanh toán
          </CustomButton>
        </div>

        <CustomTable columns={columns} dataSource={data} />
      </div>

      <AddPayment isOpen={isOpen} onCancel={() => setIsOpen(false)} />
    </>
  );
};

export default PaymentSetup;

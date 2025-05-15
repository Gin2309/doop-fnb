import React from "react";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomSwitch } from "@/components/CustomSwitch";

const Invoice = () => {
  return (
    <>
      <CustomActionHeader title="eInvoice" type="save" onSubmit={() => {}} />

      <div className="flex flex-col gap-6 mb-6">
        <div className="bg-white rounded-xl flex flex-col p-5 gap-4 shadow-md">
          <div>
            <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase mb-2">
              Phát hành hóa đơn điện tử
            </h1>
            <h2 className="text-[#333333] ">
              Bật tính năng để có thể phát hành Hóa đơn điện tử cho đơn hàng và
              sử dụng các thao tác liên quan
            </h2>
          </div>

          <div className="border-[1px] border-[#ccc]"></div>

          <div className="flex gap-3 items-center">
            <h2 className="text-[#2D3643] font-medium ">
              Cho phép phát hành Hoá đơn điện tử
            </h2>

            <CustomSwitch />
          </div>
        </div>

        <div className="bg-white rounded-xl flex flex-col p-5 gap-4 shadow-md">
          <div>
            <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase mb-2">
              Làm tròn tiền
            </h1>
            <h2 className="text-[#333333] ">
              Bật thiết lập để làm tròn giá trị tiền chiết khấu/ tiền thuế/ tiền
              tiền hàng / tiền sau thuế đến hàng đơn vị. Ví dụ: tiền thuế của
              mặt hàng là 150,000.78 sẽ được làm tròn đến hàng đơn vị là 150,001
            </h2>
          </div>

          <div className="border-[1px] border-[#ccc]"></div>

          <div className="flex gap-3 items-center">
            <h2 className="text-[#2D3643] font-medium ">
              Cho phép làm tròn tiền đến hàng đơn vị
            </h2>

            <CustomSwitch />
          </div>
        </div>

        <div className="bg-white rounded-xl flex flex-col p-5 gap-4 shadow-md">
          <div>
            <h1 className="text-[#1A1A1A] font-semibold text-[16px] uppercase mb-2">
              Kết nối mInvoice
            </h1>
            <h2 className="text-[#333333] ">
              Kết nối phần mềm quản lý hoá đơn điện tử mInvoice để tích hợp phát
              hành hoá đơn trên Doop
            </h2>
          </div>

          <div className="border-[1px] border-[#ccc]"></div>

          <div className="flex gap-3 items-center">
            <p className="text-[#333333]">
              Nhà hàng của bạn chưa kết nối với m-Invoice để phát hành hoá đơn
              điện tử trên Doop <br />- Bạn đã có tài khoản trên mInvoice.vn,
              vui lòng nhập thông tin trong mục Thiết lập.{" "}
              <span className=" text-[#3355FF] cursor-pointer">
                Xem hướng dẫn{" "}
              </span>
              <br />- Bạn chưa đăng ký tài khoản phần mềm mInvoice.vn, tìm hiểu
              thêm thông tin và đăng ký{" "}
              <span className=" text-[#3355FF] cursor-pointer">tại đây</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;

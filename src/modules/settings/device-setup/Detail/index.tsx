import React from "react";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";

const Detail = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mx-8">
        <CustomActionHeader
          title="DESKTOP-20M5BBE"
          type="delete"
          onDelete={() => {}}
          onSubmit={() => {}}
        />

        <div className="card flex flex-col gap-4">
          <div className="flex gap-2 flex-col">
            <h1 className="text-[#1a1a1a] text-[18px] uppercase font-semibold">
              {t("saleDevice")}
            </h1>

            <h1 className="text-[#666666] font-medium">
              Mỗi thiết bị sử dụng Mã thiết bị để kích hoạt và cho phép nhân
              viên đăng nhập bằng tài khoản nhân viên
            </h1>
          </div>

          <div>
            <Label label={t("deviceName")} />
            <CustomInput
              placeholder="Nhâp tên thiết bị"
              onChange={() => {}}
              value={"DESKTOP-20M5BBE"}
              className="!h-11 max-w-[700px]"
            />
          </div>

          <div>
            <Label label={t("deviceCode")} />

            <div className="justify-between flex ">
              <div className="flex bg-[#FFF7EF] rounded-xl py-5 px-12 gap-12 mb-2 uppercase text-[#FF8C00] font-semibold">
                <div className="text-[24px]">4</div>
                <div className="border-r-[1px] border-[#FFA95D] "></div>

                <div className=" text-[24px]">v</div>
                <div className="border-r-[1px] border-[#FFA95D] "></div>

                <div className=" text-[24px]">b</div>
                <div className="border-r-[1px] border-[#FFA95D] "></div>

                <div className=" text-[24px]">u</div>
                <div className="border-r-[1px] border-[#FFA95D] "></div>

                <div className=" text-[24px]">d</div>
                <div className="border-r-[1px] border-[#FFA95D] "></div>

                <div className=" text-[24px]">r</div>
              </div>
              <div></div>
            </div>

            <span className="text-[#3355FF] font-medium cursor-pointer">
              Gửi mã mới
            </span>
          </div>
        </div>

        <div className="card flex flex-col gap-4 my-6">
          <div className="flex gap-2 flex-col">
            <h1 className="text-[#1a1a1a] text-[18px] uppercase font-semibold">
              {t("deviceInfor")}
            </h1>

            <h1 className="text-[#666666] font-medium">
              Thông tin về thiết bị đa được kích hoạt
            </h1>
          </div>

          <div className="flex gap-4 flex-col">
            <div className="flex gap-3">
              <h1 className="w-[205px]">{t("deviceType")}:</h1>
              <span className="text-[#E50000]">--Chưa xác định--</span>
            </div>

            <div className="flex gap-3">
              <h1 className="w-[205px]">{t("osVersion")}:</h1>
              <span className="text-[#E50000]">--Chưa xác định--</span>
            </div>

            <div className="flex gap-3">
              <h1 className="w-[205px]">{t("deviceModel")}:</h1>
              <span className="text-[#E50000]">--Chưa xác định--</span>
            </div>

            <div className="flex gap-3">
              <h1 className="w-[205px]">{t("appVersion")}:</h1>
              <span className="text-[#E50000]">--Chưa xác định--</span>
            </div>

            <div className="flex gap-3">
              <h1 className="w-[205px]">{t("lastAccountLoggedIn")}:</h1>
              <span className="text-[#E50000]">--Chưa xác định--</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;

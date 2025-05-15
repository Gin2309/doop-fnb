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

const AddDevice = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mx-8">
        <CustomActionHeader title="addDevice" type="save" onSubmit={() => {}} />

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
              className="!h-11 max-w-[700px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDevice;

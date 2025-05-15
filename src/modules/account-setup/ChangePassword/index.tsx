import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";

import { Space } from "antd";
import Label from "@/components/CustomLabel";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import InputError from "@/components/InputError";

import schema from "./schema";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePassword } from "@/api/user.service";
import CustomNotiAction, { CustomNotiActionProps } from "../ChangePhone/NotiDashboard";

const ChangePassword = (phone: any) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiContent, setNotiContent] = useState({
    title: "",
    content: "",
    type: "success",
  });

  const {
    getValues,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  const { mutate: updatePasswordMution, isLoading: isUpdating } = useMutation(
    (data: any) => updatePassword(data),
    {
      onSuccess: () => {
        setNotiContent({
          title: "Cập nhật thành công!",
          content: "Cập nhật mật khẩu thành công.",
          type: "success",
        });
        setNotiVisible(true);
        setIsOpen(false);
        reset();
      },
      onError: (err: any) => {
        setNotiContent({
          title: "Cập nhật thất bại!",
          content:
            err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
          type: "fail",
        });
        setNotiVisible(true);
      },
    }
  );

  const handleSubmit = async () => {
    const isValid = await trigger();

    if (isValid) {
      const password = getValues("password");
      updatePasswordMution({ password });
    } else {
      message.error("Vui lòng kiểm tra lại thông tin mật khẩu trước khi gửi!");
    }
  };

  return (
    <>
      <div className="card">
        <div>
          <h1 className="uppercase mb-4 text-[#1A1A1A] font-semibold text-[18px]">
            {t("changePassword")}
          </h1>

          <p className="text-[14px] text-[#333333] mb-4">
            {t("changePassworDesc", { phone: phone.phone })}
          </p>
          {!isOpen ? (
            <>
              <CustomButton
                type="blue-btn"
                wrapClassName="w-[140px]"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                {t("changePassword")}
              </CustomButton>
            </>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="">
                      <Label infoText="" label={t("newPassword")} required />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập mật khẩu mới"
                        onChange={onChange}
                        value={value}
                      />
                      <InputError error={errors.password?.message} />
                    </div>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <div className="">
                      <Label
                        infoText=""
                        label={t("confirmPassword")}
                        required
                      />
                      <CustomInput
                        className={`suffix-icon h-11 !rounded`}
                        placeholder="Nhập mật lại khẩu mới"
                        onChange={onChange}
                        value={value}
                      />
                      <InputError error={errors.confirmPassword?.message} />
                    </div>
                  )}
                />
              </div>
              <div className="mt-6">
                <ul className="list-disc pl-5 text-[#666666] text-[14px]">
                  <li>{t("passwordLength")}</li>
                  <li>{t("noWhitespace")}</li>
                </ul>
              </div>
              <div className="flex justify-end mt-4">
                <Space>
                  <CustomButton
                    type="original"
                    wrapClassName="2xs:w-[80px] sm:w-[100px]"
                    onClick={handleCancel}
                  >
                    {t("cancel")}
                  </CustomButton>
                  <CustomButton
                    type="primary"
                    disabled={
                      isUpdating ||
                      Object.keys(errors).length > 0 ||
                      !getValues("password") ||
                      !getValues("confirmPassword")
                    }
                    wrapClassName="2xs:w-[80px] sm:w-[100px]"
                    onClick={handleSubmit}
                  >
                    {t("save")}
                  </CustomButton>
                </Space>
              </div>
            </>
          )}
        </div>
      </div>

      <CustomNotiAction
        title={notiContent.title}
        content={notiContent.content}
        type={notiContent.type as CustomNotiActionProps["type"]}
        isVisible={notiVisible}
        setIsVisible={setNotiVisible}
      />
    </>
  );
};

export default ChangePassword;

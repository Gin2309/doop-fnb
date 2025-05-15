import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { CustomModal } from "@/components/CustomModal";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";

import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";

import { setItem, getItem } from "@/helpers/storage";
import { EStorageKey } from "@/enums";
import { sentOtp, getOtp, checkPhone } from "@/api/auth.service";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import CustomNotiAction, { CustomNotiActionProps } from "./NotiDashboard";

const ChangePhoneModal = ({
  isOpen,
  onCancel,
  onSubmit,
  oldPhone,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  oldPhone: string;
}) => {
  const { t } = useTranslation();
  const [newPhone, setNewPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const newPhoneNumber = getItem(EStorageKey.TEMPORARY_TOKEN);
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiContent, setNotiContent] = useState({
    title: "",
    content: "",
    type: "success",
  });

  const handlePhoneChange = (value: string) => {
    setNewPhone(value);
    setErrorMessage("");

    if (!/^(?:\+?84|0)(?:[3|5|7|8|9])([0-9]{8})$/.test(value)) {
      setErrorMessage(t("invalidPhoneNumber"));
    } else if (value === oldPhone) {
      setErrorMessage(t("phoneSameAsOld"));
    } else {
      setErrorMessage("");
      setItem(EStorageKey.TEMPORARY_TOKEN, value);
    }
  };

  const handleCancel = () => {
    onCancel();
    setNewPhone("");
    setErrorMessage("");
  };

  const { mutate: mutateSignUp, isLoading } = useMutation(
    async () => {
      const phoneCheckResponse = await checkPhone({ phone: newPhone });

      if (phoneCheckResponse.data === true) {
        throw new Error("Số điện thoại đã được đăng ký!");
      }

      await sentOtp({ phone: newPhone });
      const otpResponse = await getOtp({ phone: newPhone });
      return otpResponse.data;
    },
    {
      onSuccess() {
        setNewPhone("");
        setTimeout(() => {
          onSubmit();
        }, 50);
      },
      onError(err: any) {
        setNotiContent({
          title: "Xác thực thất bại!",
          content: err.response?.data?.message || "Đã xảy ra lỗi!",
          type: "fail",
        });
        setNotiVisible(true);
      },
    }
  );

  const handleSubmitChangePhone = () => {
    mutateSignUp();
  };

  const handleKeyDownForPhone = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      newPhone &&
      !errorMessage &&
      newPhone !== null &&
      newPhone !== undefined
    ) {
      handleSubmitChangePhone();
    }
  };

  return (
    <>
      <CustomModal
        closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
        isOpen={isOpen}
        onCancel={handleCancel}
        onSubmit={handleSubmitChangePhone}
        customFooter
        title={t("changeRegisterPhone")}
        width={650}
      >
        <div>
          <div>
            <Label infoText="" label={t("newPhoneNumber")} />
            <CustomInput
              onChange={(value: any) => handlePhoneChange(value)}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập số điện thoại mới"
              value={newPhoneNumber}
              onKeyDown={handleKeyDownForPhone}
            />
            {errorMessage && (
              <span className="text-red-500">{errorMessage}</span>
            )}
          </div>

          <div className="flex justify-center w-[100%] gap-[15px] pt-6">
            <CustomButton
              disabled={
                !newPhone ||
                newPhone === "" ||
                !!errorMessage ||
                newPhone === null ||
                newPhone === undefined ||
                isLoading
              }
              className="!h-11 !w-[200px]"
              onClick={handleSubmitChangePhone}
              type="primary"
            >
              {t("next")}
            </CustomButton>
          </div>
        </div>
      </CustomModal>

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

export default ChangePhoneModal;

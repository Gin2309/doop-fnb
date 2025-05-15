import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { message } from "antd";

import { CustomModal } from "@/components/CustomModal";
import { CustomButton } from "@/components/CustomButton";
import { maskPhoneNumber } from "@/utils";
import CloseCircleGrayIcon from "@/assets/close.svg";

import { getItem } from "@/helpers/storage";
import { EStorageKey } from "@/enums";
import { verifyOtp, sentOtp } from "@/api/auth.service";
import { updateUser } from "@/api/user.service";
import CustomNotiAction, { CustomNotiActionProps } from "../NotiDashboard";

import { profileState } from "@/recoil/state";
import { useRecoilValue } from "recoil";

export function OTP({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const phone = getItem(EStorageKey.TEMPORARY_TOKEN);
  const [timeLeft, setTimeLeft] = useState(300);
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiContent, setNotiContent] = useState({
    title: "",
    content: "",
    type: "success",
  });
  const [isOtpFilled, setIsOtpFilled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const profileData = useRecoilValue(profileState);

  useEffect(() => {
    if (timeLeft > 0 && isOpen) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setNotiContent({
        title: "Xác thực thất bại!",
        content: "Hết thời gian, vui lòng gửi lại OTP.",
        type: "fail",
      });
      setNotiVisible(true);
      handleResendOtp();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOtpFilled(otp.every((digit) => digit !== ""));
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
    }
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    } else if (
      e.key !== "Backspace" &&
      index < otp.length - 1 &&
      otp[index] !== ""
    ) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const { mutate: updatePhoneMutation, isLoading: isUpdating } = useMutation(
    (data: any) => updateUser(data),
    {
      onSuccess(response: any) {
        setNotiContent({
          title: "Cập nhật thành công!",
          content: "Số điện thoại của bạn đã được cập nhật.",
          type: "success",
        });
        profileData.refetch();
        setOtp(["", "", "", "", "", ""]);
        onCancel();
        setNotiVisible(true);
      },
      onError(err: any) {
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

  const { mutate: verifyOtpMutation, isLoading: isVerifying } = useMutation(
    (otpCode: string) => verifyOtp({ phone, otp: otpCode }),
    {
      onSuccess: () => {
        updatePhoneMutation({ phone });
      },
      onError: (err: any) => {
        setNotiContent({
          title: "Xác thực thất bại!",
          content: err.response?.data?.message,
          type: "fail",
        });
        setNotiVisible(true);
      },
    }
  );

  const handleSubmit = () => {
    verifyOtpMutation(otp.join(""));
  };

  const handleResendOtp = async () => {
    try {
      await sentOtp({ phone });
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      message.success("Gửi lại mã OTP thành công!");
    } catch (error) {
      setNotiContent({
        title: "Lỗi gửi OTP!",
        content: "Không thể gửi lại mã OTP, vui lòng thử lại.",
        type: "fail",
      });
      setNotiVisible(true);
    }
  };

  const handleCancel = () => {
    setOtp(["", "", "", "", "", ""]);
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isOtpFilled) {
      handleSubmit();
    }
  };

  return (
    <>
      <CustomModal
        closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
        isOpen={isOpen}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        customFooter
        title={t("otpInput")}
        width={650}
      >
        <div className="pb-6">
          <p className="mb-4 text-center">
            Chúng tôi gửi mã xác minh cho bạn số điện thoại <br />
            <strong className="text-[#3355FF] px-[5px]">
              {phone && maskPhoneNumber(phone as string)}
            </strong>
            . Bạn có thể kiểm tra tin nhắn của bạn.
          </p>
          <div className="text-[#FF3B3B] font-semibold text-center">
            {`${Math.floor(timeLeft / 60)
              .toString()
              .padStart(2, "0")}:${(timeLeft % 60)
              .toString()
              .padStart(2, "0")}`}
          </div>

          <div className="flex justify-center my-[20px] gap-[10px]">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="h-[55px] w-[46px] text-center font-bold text-[#28293D] text-[32px] bg-[#F2F2F5] focus:outline-none"
                value={digit}
                maxLength={1}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyUp={(e) => handleKeyUp(e, index)}
                onKeyDown={handleKeyDown}
              />
            ))}
          </div>

          <div
            onClick={handleResendOtp}
            className="flex items-center justify-center mt-[10px] underline text-custom-orange cursor-pointer"
          >
            <p>{t("noCodeReceived")}</p>
            <p className="font-medium px-[5px] leading-[24px] text-end">
              {t("resend")}
            </p>
          </div>
        </div>

        <div className="flex justify-center w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            disabled={!isOtpFilled || isVerifying || isUpdating}
            className="!h-11 !w-[200px]"
            onClick={handleSubmit}
            type="primary"
          >
            {t("next")}
          </CustomButton>
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
}

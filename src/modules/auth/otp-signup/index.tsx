import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { CustomAuthWrapper } from "@/components/CustomAuthWrapper";
import { CustomInput } from "@/components/CustomInput";
import { getOtp, sentOtp, verifyOtp } from "@/api/auth.service";
import { message } from "antd";
import Link from "next/link";
import { maskPhoneNumber } from "@/utils";

export function OTP() {
  const [otp, setOtp] = useState<string | null>(null);
  const [otpInputs, setOtpInputs] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storedOtp, setStoredOtp] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const router = useRouter();
  const { phone } = router.query;

  useEffect(() => {
    const otpFromStorage = sessionStorage.getItem("otp");
    if (otpFromStorage) {
      setStoredOtp(otpFromStorage);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    if (otp && phone) {
      const verify = async () => {
        try {
          await verifyOtp({ phone: phone as string, otp });
          message.success("Xác thực thành công!");
          sessionStorage.setItem("phone", phone as string);
          setTimeout(() => {
            router.push("/auth/info");
          }, 1000);
        } catch (error) {
          message.error("Xác thực thất bại!");
        }
      };

      verify();
    }
  }, [otp, phone, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || value.length > 1) {
      setErrorMessage("Không được nhập chữ hoặc ký tự đặc biệt!");
      return;
    } else {
      setErrorMessage(null);
    }

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtpInputs.every((val) => val !== "")) {
      setOtp(newOtpInputs.join(""));
    }
  };

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (/[^0-9]/.test(value)) {
      setErrorMessage("Không được nhập chữ hoặc ký tự đặc biệt!");
      return;
    }

    setErrorMessage(null);

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtpInputs.every((val) => val !== "")) {
      setOtp(newOtpInputs.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
      setErrorMessage("Không được nhập chữ hoặc ký tự đặc biệt!");
    }

    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (!otpExpired) {
      message.warning("Mã chưa hết hiệu lực, vui lòng không gửi lại.");
      return;
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }

    try {
      await sentOtp({ phone });
      const response = await getOtp({ phone: phone as string });
      if (response) {
        const newOtp = response.data;
        setStoredOtp(newOtp);
        sessionStorage.setItem("otp-password", newOtp);
        setOtpExpired(false);
        setTimeLeft(300);
        setOtpInputs(Array(6).fill(""));
        setOtp(null);
        message.success("Mã OTP đã được gửi lại!");

        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setOtpExpired(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    } catch (error) {
      message.error("Gửi lại OTP thất bại!");
    }

    return;
  };

  return (
    <CustomAuthWrapper title="Nhập mã OTP">
      <div className="mb-4">
        <p className="mb-[15px] text-center">
          Chúng tôi gửi mã xác minh cho bạn số điện thoại
          <strong className="text-[#3355FF] px-[5px]">
            {phone && maskPhoneNumber(phone as string)}
          </strong>
          Bạn có thể kiểm tra tin nhắn của bạn.
        </p>
        <span
          className={`text-[#FF3B3B] font-semibold ${
            otpExpired ? "line-through" : ""
          }`}
        >
          {otpExpired ? "" : formatTimeLeft(timeLeft)}
        </span>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex gap-[15px] justify-center my-[20px]">
          {otpInputs.map((value, index) => (
            <CustomInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="h-[55px] w-[46px] text-center font-bold text-[#28293D] text-[32px] bg-[#F2F2F5]"
              value={value}
              onChange={(val) => handleChange(index, val)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onInput={(e) => handleInput(index, e)}
              maxLength={1}
              // disabled={otpExpired}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center mt-[10px] underline text-custom-orange">
        <p>Tôi không nhận được mã?</p>

        <button
          className="font-medium px-[5px] leading-[24px] text-end cursor-pointer"
          onClick={handleResendOtp}
        >
          Gửi lại
        </button>
      </div>
    </CustomAuthWrapper>
  );
}

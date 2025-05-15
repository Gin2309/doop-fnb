import { sentOtp, getOtp, checkPhone } from "@/api/auth.service";
import { CustomAuthWrapper } from "@/components/CustomAuthWrapper";
import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import InputError from "@/components/InputError";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { message } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";

export function SignUp() {
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  const router = useRouter();

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { mutate: mutateSignUp, isLoading } = useMutation(
    async () => {
      const values = getValues();
      const phoneCheckResponse = await checkPhone({ phone: values.phone });

      if (phoneCheckResponse.data === true) {
        message.error((phoneCheckResponse as any).message);
        throw new Error("Số điện thoại đã được đăng ký!");
      }

      await sentOtp(values);
      const otpResponse = await getOtp(values);
      return otpResponse.data;
    },
    {
      onSuccess(otp) {
        message.success("Thành công!");
        sessionStorage.setItem("otp", otp);
        const values = getValues();
        setTimeout(() => {
          router.push({
            pathname: "/auth/otp-signup",
            query: { phone: values.phone },
          });
        }, 1000);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const onSubmit = () => {
    if (!isTermsChecked) {
      message.error(
        "Bạn phải đồng ý với chính sách bảo vệ và quy định sử dụng!"
      );
      return;
    }
    mutateSignUp();
  };

  return (
    <CustomAuthWrapper title="Đăng ký tài khoản ">
      <div className="mb-3 text-start">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <div>
              <CustomInput
                className="h-[56px]"
                placeholder="Số điện thoại của bạn"
                maxLength={10}
                {...field}
              />
              <InputError error={errors.phone?.message} />
            </div>
          )}
        />
      </div>

      <div className="text-start">
        <CustomCheckbox
          checked={isTermsChecked}
          onChange={(e) => setIsTermsChecked(e.target.checked)}
        >
          <span className="!text-[14px] !text-nowrap tracking-[-0.6px]">
            Tôi đã đọc, đồng ý với 
            <Link href="">Chính sách bảo vệ dữ liệu cá nhân </Link> & 
            <Link href="">Quy định sử dụng</Link> của Doop
          </span>
        </CustomCheckbox>
      </div>

      <div className="mt-[20px]">
        <CustomButton
          className="!h-[56px] !w-full mx-auto "
          type="primary"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          onEnter={handleSubmit(onSubmit)}
        >
          Đăng ký
        </CustomButton>
      </div>

      <div className="flex items-center justify-center mt-[10px]">
        <p>Đã có tài khoản?</p>

        <Link href="/auth/sign-in">
          <p className=" font-medium px-[5px] leading-[24px] text-custom-orange hover:no-underline text-end cursor-pointer">
            Đăng nhập ngay
          </p>
        </Link>
      </div>
    </CustomAuthWrapper>
  );
}

import { CustomAuthWrapper } from "@/components/CustomAuthWrapper";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import InputError from "@/components/InputError";
import { useRouter } from "next/router";
import { schema } from "../sign-up/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { checkPhone, getOtp, sentOtp } from "@/api/auth.service";
import { message } from "antd";

export function ForgotPassword() {
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
      console.log("Check: ", phoneCheckResponse.data);

      if (phoneCheckResponse.data === false) {
        message.error("Số điện thoại chưa được đăng ký!");
        throw new Error("Số điện thoại chưa được đăng ký!");
      }

      await sentOtp(values);
      const otpResponse = await getOtp(values);
      return otpResponse.data;
    },
    {
      onSuccess(otp) {
        message.success("Thành công!");
        sessionStorage.setItem("otp-password", otp);
        const values = getValues();
        setTimeout(() => {
          router.push({
            pathname: "/auth/otp",
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
    mutateSignUp();
  };

  return (
    <CustomAuthWrapper title="Quên mật khẩu">
      <div className="mb-4 text-start">
        <p className="mb-[15px]">
          Nhập số điện thoại của bạn và chúng tôi sẽ gửi cho bạn một mã xác nhận
          để đặt lại mật khẩu của bạn.
        </p>
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

      <div className="mt-[35px]">
        <CustomButton
          className="!h-[56px] !w-full mx-auto"
          type="primary"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          onEnter={handleSubmit(onSubmit)}
        >
          Tiếp tục
        </CustomButton>
      </div>
    </CustomAuthWrapper>
  );
}

import { CustomAuthWrapper } from "@/components/CustomAuthWrapper";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import InputError from "@/components/InputError";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { changePass } from "@/api/auth.service";
import { omit } from "lodash";
import { message } from "antd";

export function ChangePassword() {
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phone-change");
    if (storedPhone) {
      setPhone(storedPhone);
      sessionStorage.removeItem("phone-change");
    }
  }, []);

  const {
    getValues,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (phone) {
      setValue("phone", phone);
    }
  }, [phone, setValue]);

  const { mutate: mutateChangePass, isLoading } = useMutation(
    () => changePass(omit(getValues(), ["confirmPassword"])),
    {
      onSuccess() {
        message.success("Cập nhật mật khẩu thành công!", 1);
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 1000);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/auth/forgot-password");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const onSubmit = () => {
    mutateChangePass();
  };

  return (
    <CustomAuthWrapper title="Đặt lại mật khẩu">
      <div className="flex mb-4 justify-between w-full md:gap-[20px] 2xs:gap-[10px] mt-[20px]">
        <div className="text-start flex-1">
          <Label infoText="" label="Mật khẩu mới" required />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div>
                <CustomInput
                  className="h-[44px]"
                  placeholder="Mật khẩu mới"
                  type="password"
                  {...field}
                />
                <InputError error={errors.password?.message} />
              </div>
            )}
          />
          <InputError error="" />
        </div>
        <div className="text-start flex-1">
          <Label infoText="" label="Xác nhận mật khẩu" required />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div>
                <CustomInput
                  className="h-[44px]"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  {...field}
                />
                <InputError error={errors.confirmPassword?.message} />
              </div>
            )}
          />
          <InputError error="" />
        </div>
      </div>
      <ul className="pl-[20px] text-start">
        <li className="list-disc text-[#777]">Độ dài từ 6 - 32 ký tự</li>
        <li className="list-disc text-[#777]">Không chứa khoảng trắng</li>
      </ul>
      <div className="mt-[55px]">
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

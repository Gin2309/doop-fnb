import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { login } from "@/api/auth.service";
import HidePassword from "@/assets/images/hide-password.png";
import ViewPassword from "@/assets/images/view-password.png";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import InputError from "@/components/InputError";
import { getItem, getToken, setToken, clearToken } from "@/helpers/storage";
import { schema } from "./schema";
import { CustomAuthWrapper } from "@/components/CustomAuthWrapper";
import Link from "next/link";
import BlockModal from "./BlockModal";
import { useRecoilState } from "recoil";
import { profileState } from "@/recoil/state";

export function SignIn() {
  const router = useRouter();
  const [, setProfileState] = useRecoilState(profileState);
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const {
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      role: "FNB",
    },
  });

  const { mutate: mutateSignIn, isLoading } = useMutation(
    () => login(getValues()),
    {
      onSuccess(response: any) {
        setToken(response?.data?.token);
        message.success("Đăng nhập thành công!", 1);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      },
      onError(err: any) {
        if (err.response.data.statusCode === 423) {
          setIsModalOpen(true);
        } else {
          const errorMessage =
            err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
          message.error(errorMessage);
        }
      },
    }
  );

  const onSubmit = () => {
    mutateSignIn();
  };

  useEffect(() => {
    clearToken();
    setProfileState(null);
  }, []);

  return (
    <CustomAuthWrapper title="Đăng nhập">
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div className="mb-4 text-start">
            <CustomInput
              className="h-[56px]"
              placeholder="Số điện thoại"
              maxLength={10}
              {...field}
            />
            <InputError error={errors.phone?.message} />
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div className="mb-1 text-start">
            <CustomInput
              type={isHidePassword ? "password" : "text"}
              className="h-[56px]"
              placeholder="Mật khẩu"
              {...field}
              suffixIcon={
                <Image
                  src={isHidePassword ? HidePassword : ViewPassword}
                  alt=""
                  onClick={() => setIsHidePassword((pre) => !pre)}
                  width={16}
                  height={16}
                  className=" cursor-pointer"
                />
              }
            />
            <InputError error={errors.password?.message} />
          </div>
        )}
      />
      <Link href="/auth/forgot-password">
        <span className=" min-w-[30px] py-1 float-right  mb-5 font-medium px-[5px] leading-[24px] text-custom-orange hover:no-underline text-end cursor-pointer">
          Quên mật khẩu?
        </span>
      </Link>
      <div className="mt-[35px]">
        <CustomButton
          className="!h-[56px] !w-full mx-auto"
          type="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          onEnter={handleSubmit(onSubmit)}
        >
          Đăng nhập
        </CustomButton>
      </div>
      <div className="flex items-center justify-center mt-[10px]">
        <p>Chưa có tài khoản?</p>

        <Link href="/auth/sign-up">
          <p className=" font-medium px-[5px] leading-[24px] text-custom-orange hover:no-underline text-end cursor-pointer">
            Đăng ký ngay
          </p>
        </Link>
      </div>
      {isModalOpen && (
        <BlockModal isOpen={isModalOpen} onCancel={handleCancel} />
      )}
    </CustomAuthWrapper>
  );
}

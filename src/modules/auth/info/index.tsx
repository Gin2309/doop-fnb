import { useRouter } from "next/router";
import LogoAuth from "@/assets/logo_auth.svg";
import Image from "next/image";
import Label from "@/components/CustomLabel";
import { CustomInput } from "@/components/CustomInput";
import InputError from "@/components/InputError";
import { CustomButton } from "@/components/CustomButton";
import { CustomSelect } from "@/components/CustomSelect";
import { schema } from "./schema";
import { Controller, useForm } from "react-hook-form";
import { message } from "antd";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { register1 } from "@/api/auth.service";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import Link from "next/link";
import CustomUpload from "@/components/CustomUpload";

import Service1 from "@/assets/service1.svg";
import Service2 from "@/assets/service2.svg";
import Service3 from "@/assets/service3.svg";
import Service4 from "@/assets/service4.svg";
import Service5 from "@/assets/service5.svg";
import Service6 from "@/assets/service6.svg";
import Service7 from "@/assets/service7.svg";
import Service8 from "@/assets/service8.svg";

export function Info() {
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);

  const services = [
    { label: "Ăn uống", value: "Ăn uống", image: Service1 },
    { label: "Karaoke", value: "Karaoke", image: Service2 },
    {
      label: "Nhà nghỉ, khách sạn",
      value: "Nhà nghỉ, khách sạn",
      image: Service3,
    },
    { label: "Ghế massage", value: "Ghế massage", image: Service4 },
    { label: "Bi a", value: "Bi-a", image: Service5 },
    { label: "Game", value: "Game", image: Service6 },
    { label: "Ghế làm việc", value: "Ghế làm việc", image: Service7 },
    { label: "Khác", value: "Khác", image: Service8 },
  ];

  const handleServiceSelect = (value: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(value)) {
        return prev.filter((service) => service !== value);
      } else {
        return [...prev, value];
      }
    });
    setValue("interestService", selectedServices);
  };

  useEffect(() => {
    const storedPhone = sessionStorage.getItem("phone");
    if (storedPhone) {
      setPhone(storedPhone);
      sessionStorage.removeItem("phone");
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
    defaultValues: {
      interestService: [],
    },
  });

  useEffect(() => {
    if (phone) {
      setValue("phone", phone);
    }
  }, [phone, setValue]);

  const { mutate: mutateSignIn, isLoading } = useMutation(
    () => register1(omit(getValues(), ["confirmPassword"])),
    {
      onSuccess() {
        message.success("Đăng ký thành công!", 1);
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 1000);
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
        if (
          err.response.data.statusCode === 400 ||
          errorMessage.includes("Email đã tồn tại")
        ) {
          setStep(1);
        }
      },
    }
  );

  const onSubmit = () => {
    if (step === 1) {
      setStep(2);
    } else {
      if (selectedServices.length === 0) {
        message.error("Vui lòng chọn ít nhất một lĩnh vực bạn quan tâm.");
        return;
      }
      setValue("interestService", selectedServices);
      mutateSignIn();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/auth/sign-up/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  http: return (
    <div className="bg-auth mx-auto flex w-full py-[30px] min-h-[100vh] min-h-full-screen flex-col items-center justify-center">
      <div className="lg:w-[720px] 2xs:w-full h-auto sm:p-[40px] 2xs:p-[10px]  text-center bg-white  rounded-[32px]">
        <Link href="/auth/sign-in">
          <Image src={LogoAuth} alt="Logo" className="cursor-pointer" />
        </Link>
        <h1 className="text-[34px] font-semibold leading-[48px] py-[5px] mb-[20px] mt-[10px]">
          {step === 1 ? "Nhập thông tin" : "Lĩnh vực mà bạn quan tâm"}
        </h1>
        {step === 1 ? (
          <div className="info">
            <div className="flex mb-4 justify-between w-full gap-[20px] mt-[30px]">
              <div className="text-start flex-1">
                <Label infoText="" label="Họ và tên" required />

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <CustomInput
                        className="h-[44px]"
                        placeholder="Họ và tên"
                        {...field}
                      />
                      <InputError error={errors.name?.message} />
                    </div>
                  )}
                />
              </div>
              <div className="text-start flex-1">
                <Label infoText="" label="Số điện thoại" required />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <CustomInput
                        className="h-[44px]"
                        placeholder="Số điện thoại"
                        {...field}
                        disabled
                      />
                      <InputError error={errors.phone?.message} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="mb-4">
              <Label infoText="" label="Đặt mật khẩu đăng nhập" />
              <div className="flex mb-4 justify-between w-full gap-[20px] mt-[20px]">
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
                </div>
              </div>
              <ul className="pl-[20px] text-start">
                <li className="list-disc text-[#777]">
                  Độ dài từ 6 - 32 ký tự
                </li>
                <li className="list-disc text-[#777]">
                  Không chứa khoảng trắng
                </li>
              </ul>
            </div>

            <div className="flex mb-4 justify-between w-full gap-[20px] mt-[20px]">
              <div className="text-start flex-1">
                <Label infoText="" label="Email" />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <CustomInput
                        className="h-[44px]"
                        placeholder="Email"
                        {...field}
                      />
                      <InputError error={errors.email?.message} />
                    </div>
                  )}
                />
              </div>
              <div className="text-start flex-1">
                <Label infoText="" label="Giới tính" />

                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <CustomSelect
                        className="h-11 "
                        options={[
                          { label: "Nam", value: "MALE" },
                          { label: "Nữ", value: "FEMALE" },
                        ]}
                        {...field}
                      />
                      <InputError error={errors.sex?.message} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="text-start flex-1 mb-4">
              <Label infoText="" label="Địa chỉ" />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <CustomInput
                      className="h-[44px]"
                      placeholder="Địa chỉ"
                      {...field}
                    />
                    <InputError error={errors.address?.message} />
                  </div>
                )}
              />
            </div>

            <div className="text-start flex-1 mb-9">
              <Label infoText="" label="Giấy tờ tùy thân" />
              <div className="flex gap-[10px]">
                <div className="w-[158px] max-h-[140px]">
                  <CustomUpload
                    value={getValues("identityCardFront") as any}
                    type="type-1"
                    onChangeValue={(value) =>
                      setValue("identityCardFront", value, {
                        shouldValidate: true,
                      })
                    }
                    title="Mặt trước"
                  ></CustomUpload>
                </div>
                <div className="w-[160px] h-[140px]">
                  <CustomUpload
                    value={getValues("identityCardBack") as any}
                    onChangeValue={(value) =>
                      setValue("identityCardBack", value)
                    }
                    type="type-1"
                    title="Mặt sau"
                  ></CustomUpload>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="services mb-[40px] grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.value}
                className={`h-[189px] border-[1px] rounded-[21px] gap-[15px] flex flex-col items-center justify-center cursor-pointer ${
                  selectedServices.includes(service.value)
                    ? "border-orange-500"
                    : ""
                }`}
                onClick={() => handleServiceSelect(service.value)}
              >
                <Image
                  src={service.image}
                  alt={service.label}
                  className="w-[80px] h-[80px] mb-2"
                />
                <span>{service.label}</span>
              </div>
            ))}
          </div>
        )}

        <CustomButton
          className="!h-[56px] !w-[70%] mx-auto"
          type="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          onEnter={handleSubmit(onSubmit)}
        >
          Tiếp tục
        </CustomButton>
      </div>
    </div>
  );
}

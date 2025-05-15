import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { profileState } from "@/recoil/state";
import { useRecoilValue, useRecoilState } from "recoil";
import { clearToken } from "@/helpers/storage";

import { Skeleton } from "antd";
import Label from "@/components/CustomLabel";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomRadio } from "@/components/CustomRadio";
import CustomActionHeader from "@/components/CustomActionHeader";
import CustomUpload2 from "./Upload";
import CustomColorPicker from "@/components/CustomColorPicker";
import ChangePassword from "./ChangePassword";
import DeleteModal from "./DeleteModal";
import Card from "./Card";
import ChangePhoneModal from "./ChangePhone/ChangePhoneModal";
import { OTP } from "./ChangePhone/otp";
import { isColorAvatar } from "@/utils";

import Delete from "@/assets/deleteWhite.svg";

import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import InputError from "@/components/InputError";
import { EStorageKey } from "@/enums";

import { updateUser, deleteAcc } from "@/api/user.service";
import CustomNotiAction, { CustomNotiActionProps } from "./ChangePhone/NotiDashboard";

const Account = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const data = useRecoilValue(profileState);
  const [, setProfileState] = useRecoilState(profileState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [avatarOption, setAvatarOption] = useState("picture");

  const [changePhoneModal, setChangePhoneModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [notiVisible, setNotiVisible] = useState(false);
  const [notiContent, setNotiContent] = useState({
    title: "",
    content: "",
    type: "success",
  });

  const profile = data?.data;
  const isGettingProfile = data?.isLoading;
  const isDisable = profile?.status === "ACTIVE";

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const {
    getValues,
    setValue,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: profile?.name || null,
      phone: profile?.phone || null,
      email: profile?.email || null,
      sex: profile?.sex || null,
      address: profile?.address || null,
      avatar: profile?.avatar || null,
      identityCardFront: profile?.identityCardFront || null,
      identityCardBack: profile?.identityCardBack || null,
      interestService: profile?.interestService || null,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile?.name || null,
        phone: profile?.phone || null,
        email: profile?.email || null,
        sex: profile?.sex || null,
        address: profile?.address || null,
        avatar: profile?.avatar || null,
        identityCardFront: profile?.identityCardFront || null,
        identityCardBack: profile?.identityCardBack || null,
        interestService: profile?.interestService || null,
      });
    }
  }, [profile, reset]);

  const genderGroup = {
    data: {
      items: [
        { id: "MALE", name: "Nam" },
        { id: "FEMALE", name: "Nữ" },
      ],
    },
  };

  const { mutate: handleDeleteAcc, isLoading } = useMutation(
    () => deleteAcc(),
    {
      onSuccess(response: any) {
        clearToken();
        setProfileState(null);
        setNotiContent({
          title: "Thành công!",
          content: "Xóa tài khoản thành công.",
          type: "success",
        });
        setNotiVisible(true);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      },
      onError(err: any) {
        setNotiContent({
          title: "Thất bại!",
          content: err.response?.data?.message,
          type: "fail",
        });
        setNotiVisible(true);
      },
    }
  );

  const onSubmit = () => {
    handleDeleteAcc();
  };

  const { mutate: updateMution, isLoading: isUpdating } = useMutation(
    (data: any) => updateUser(data),
    {
      onSuccess(response: any) {
        setNotiContent({
          title: "Thành công!",
          content: "Cập nhật tài khoản thành công.",
          type: "success",
        });
        data.refetch();
        setNotiVisible(true);
      },
      onError(err: any) {
        setNotiContent({
          title: "Thất bại!",
          content: err.response?.data?.message,
          type: "fail",
        });
        setNotiVisible(true);
      },
    }
  );

  const onHandleSubmit = () => {
    const submitData = getValues();
    updateMution(submitData);
  };

  useEffect(() => {
    if (profile) {
      if (isColorAvatar(profile.avatar)) {
        setAvatarOption("color");
      }
      reset(profile);
    }
  }, [profile]);

  const handleModal1Submit = () => {
    setChangePhoneModal(false);
    setOtpModal(true);
  };

  const handleModal1CLose = () => {
    setChangePhoneModal(false);
    localStorage.removeItem(EStorageKey.TEMPORARY_TOKEN);
  };

  const handleModal2Close = () => {
    setOtpModal(false);
    localStorage.removeItem(EStorageKey.TEMPORARY_TOKEN);
  };

  const options = [
    { label: "Ăn uống", value: "Ăn uống" },
    { label: "Karaoke", value: "Karaoke" },
    { label: "Nhà nghỉ, khách sạn", value: "Nhà nghỉ, khách sạn" },
    { label: "Ghế massage", value: "Ghế massage" },
    { label: "Bi a", value: "Bi a" },
    { label: "Game", value: "Game" },
    { label: "Ghế làm việc", value: "Ghế làm việc" },
  ];

  return (
    <>
      <div>
        <CustomActionHeader
          btnTitle="update"
          type="save"
          title="accountSetup"
          isLoading={isUpdating}
          onSubmit={handleSubmit(onHandleSubmit)}
        />

        {isGettingProfile ? (
          <Skeleton active />
        ) : (
          <>
            <div className="grid 2xs:grid-cols-1 md:grid-cols-3 2xs:gap-4 lg:gap-6">
              <div className="2xs:gap-4 lg:gap-6 flex flex-col 2xs:col-span-1 md:col-span-2">
                <div className="card">
                  <div className="flex justify-between mb-4">
                    <h1 className="uppercase mb-4 text-[#1A1A1A] font-semibold text-[18px]">
                      {t("acccountInfo")}
                    </h1>

                    <Card status={profile?.status} />
                  </div>

                  <div className="grid md:grid-cols-2 2xs:gap-4 lg:gap-6">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Label
                            infoText=""
                            label={t("customerFullName")}
                            required
                          />
                          <CustomInput
                            disabled={isDisable}
                            className={`suffix-icon h-11 !rounded`}
                            placeholder="Nhập họ và tên"
                            onChange={onChange}
                            value={value}
                          />
                          <InputError error={errors.name?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="phone"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Label
                            infoText=""
                            label={t("phoneNumber")}
                            required
                          />
                          <div className="relative">
                            <CustomInput
                              className="suffix-icon h-11 !rounded"
                              placeholder="Nhập số điện thoại "
                              onChange={onChange}
                              value={value}
                              disabled={true}
                            />
                            <div
                              onClick={() =>
                                !isDisable && setChangePhoneModal(true)
                              }
                              className="absolute top-[4.5px] right-1 border-[1px] cursor-pointer border-[#4A72FF] rounded-sm px-3 py-1.5 text-[#1B4DFF] font-semibold"
                            >
                              {t("Đổi số")}
                            </div>
                          </div>
                          <InputError error={errors.phone?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Label infoText="" label={t("email")} />
                          <CustomInput
                            className="suffix-icon h-11 !rounded"
                            placeholder="Nhập email"
                            onChange={onChange}
                            value={value}
                          />
                          <InputError error={errors.email?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="sex"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <div>
                            <Label infoText="" label={t("gender")} />
                            <CustomSelect
                              options={genderGroup?.data?.items?.map(
                                (item) => ({
                                  value: item.id,
                                  label: item.name,
                                })
                              )}
                              showSearch={true}
                              onChange={onChange}
                              value={value}
                              className="suffix-icon h-11 !rounded"
                              placeholder="Chọn giới tính"
                            />
                            <InputError error={errors.sex?.message} />
                          </div>
                        );
                      }}
                    />

                    <Controller
                      name="address"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <Label infoText="" label={t("address")} />
                          <CustomInput
                            className="suffix-icon h-11 !rounded"
                            placeholder="Nhập địa chỉ cụ thể"
                            onChange={onChange}
                            value={value ?? ""}
                          />
                          <InputError error={errors.address?.message} />
                        </div>
                      )}
                    />

                    <Controller
                      name="interestService"
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <div>
                            <Label infoText="" label={t("areasOfInterest")} />
                            <CustomSelect
                              mode="tags"
                              allowClear
                              className="suffix-icon h-11 !rounded multiple"
                              onChange={onChange}
                              value={value}
                              options={options}
                              placeholder="Chọn lĩnh vực"
                            />
                            <InputError
                              error={errors.interestService?.message}
                            />
                          </div>
                        );
                      }}
                    />

                    <div className="md:col-span-2">
                      <Label infoText="" label={t("identityDocument")} />
                      <div className="flex gap-4">
                        <div className="h-[140px] w-[150px]">
                          <CustomUpload2
                            value={getValues("identityCardFront")}
                            type="type-1"
                            onChangeValue={(url) =>
                              setValue("identityCardFront", url)
                            }
                          />
                        </div>
                        <div className="h-[140px] w-[150px]">
                          <CustomUpload2
                            value={getValues("identityCardBack")}
                            type="type-1"
                            onChangeValue={(url) =>
                              setValue("identityCardBack", url)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ChangePassword phone={profile?.phone} />
              </div>

              <div className="col-span-1 2xs:gap-4 lg:gap-6 flex flex-col">
                <div className="card">
                  <Label infoText="" label={t("avatar")} />
                  <div className="gap-4 flex flex-col">
                    <CustomRadio
                      options={[
                        { value: "picture", label: "Hình ảnh" },
                        { value: "color", label: "Màu sắc" },
                      ]}
                      value={avatarOption}
                      onChange={(e) => {
                        setAvatarOption(e);
                      }}
                      gap={16}
                    />
                    <div>
                      <div
                        className={`${
                          avatarOption === "picture" ? "h-[300px]" : ""
                        } w-full`}
                      >
                        {avatarOption === "picture" ? (
                          <CustomUpload2
                            value={
                              getValues("avatar")?.startsWith("#")
                                ? null
                                : getValues("avatar")
                            }
                            type="type-2"
                            onChangeValue={(url) => setValue("avatar", url)}
                          />
                        ) : (
                          <CustomColorPicker
                            values={
                              getValues("avatar")
                                ? [getValues("avatar")]
                                : (null as any)
                            }
                            onChangeValue={(value) =>
                              setValue("avatar", value, {
                                shouldValidate: true,
                              })
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h1 className="text-[#1A1A1A] font-semibold uppercase text-[18px]">
                    {t("recentActivities")}
                  </h1>
                  <div className="mt-4">
                    <div className="flex flex-col gap-4 relative">
                      {/* Divider nối các dấu chấm tròn */}
                      <div className="absolute left-[6px] top-[14px] bottom-0 flex flex-col items-center">
                        <div className="w-0.5 h-full border-l-2 border-dashed border-[#bababa]"></div>
                      </div>

                      {/* Phần tử 1 */}
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-[14px] h-[14px] border-[3px] border-[#fff] shadow-md bg-[#ff5c00] rounded-full relative z-[2]"></div>
                        <div>
                          <span className="text-[#0070F4]">
                            Mr.Dodo - Admin
                          </span>{" "}
                          vừa <span className="text-[#0070F4]">nhập hàng</span>{" "}
                          với giá trị{" "}
                          <span className="font-semibold">1,000,000 đ</span>
                        </div>
                      </div>

                      {/* Phần tử 2 */}
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-[14px] h-[14px] border-[3px] border-[#fff] shadow-md bg-[#ff5c00] rounded-full relative z-[2]"></div>
                        <div>
                          <span className="text-[#0070F4]">
                            Mr.Dodo - Admin
                          </span>{" "}
                          vừa <span className="text-[#0070F4]">nhập hàng</span>{" "}
                          với giá trị{" "}
                          <span className="font-semibold">1,000,000 đ</span>
                        </div>
                      </div>

                      {/* Phần tử 3 */}
                      <div className="relative flex gap-4">
                        <div className="flex-shrink-0 w-[14px] h-[14px] border-[3px] border-[#fff] shadow-md bg-[#ff5c00] rounded-full relative z-[2]"></div>
                        <div>
                          <span className="text-[#0070F4]">
                            Mr.Dodo - Admin
                          </span>{" "}
                          vừa <span className="text-[#0070F4]">nhập hàng</span>{" "}
                          với giá trị{" "}
                          <span className="font-semibold">1,000,000 đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="2xs:my-4 lg:my-6">
              <CustomButton
                type="danger"
                disabled={isUpdating || isLoading}
                wrapClassName="2xs:w-[120px] sm:w-[158px]"
                onClick={() => setOpenDeleteModal(true)}
                prefixIcon={
                  isSmallScreen ? null : (
                    <>
                      <div className="h-[18px] w-[18px] mt-[-5px]">
                        <Image src={Delete} />
                      </div>
                    </>
                  )
                }
              >
                {t("deleteAcccount")}
              </CustomButton>
            </div>
          </>
        )}

        <DeleteModal
          isOpen={openDeleteModal}
          onCancel={() => setOpenDeleteModal(false)}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        <ChangePhoneModal
          isOpen={changePhoneModal}
          onCancel={handleModal1CLose}
          oldPhone={profile?.phone}
          onSubmit={handleModal1Submit}
        />

        <OTP isOpen={otpModal} onCancel={handleModal2Close} />

        <CustomNotiAction
          title={notiContent.title}
          content={notiContent.content}
          type={notiContent.type as CustomNotiActionProps["type"]}
          isVisible={notiVisible}
          setIsVisible={setNotiVisible}
        />
      </div>
    </>
  );
};

export default Account;

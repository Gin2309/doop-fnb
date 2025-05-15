import type { MenuProps } from "antd";
import { Badge, Dropdown, Menu, Popover, Space } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import DropdownIcon from "@/assets/dropdownIcon.svg";
import { clearToken } from "@/helpers/storage";
import {
  profileState,
  notificationState,
  branchStateSession,
  provinceState,
  posRouterState,
} from "@/recoil/state";
import Avatars from "@/assets/Avatar.svg";
import VieIcon from "@/assets/vieIcon.svg";
import EnIcon from "@/assets/enIcon.svg";
import UserIcon from "@/assets/UserCircle.svg";
import LogoutIcon from "@/assets/SignOut.svg";
import WalletIcon from "@/assets/Wallet.svg";
import NoteBookIcon from "@/assets/Notebook.svg";
import PavicyIcon from "@/assets/Pavicy.svg";
import HeadPhoneIcon from "@/assets/Headset.svg";
import LeftArrow from "@/assets/LeftChevron.svg";
import RightArrow from "@/assets/CaretRight.svg";
import HeadSet from "@/assets/Headset3.svg";
import QR from "@/assets/QR.svg";
import Noti from "@/assets/noti.svg";
import NotiPopover from "@/modules/noti-popover";
import { isColorAvatar } from "@/utils";

import { CustomButton } from "@/components/CustomButton";
import styled from "styled-components";
import i18next from "i18next";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getValidImageUrl } from "@/utils";

import { useQuery } from "@tanstack/react-query";
import {
  getNotification,
  seenNotification,
  notiCount,
} from "@/api/notification.service";
import { getProvince } from "@/api/customer.service";
import { useMutation } from "@tanstack/react-query";

// import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "sonner";

export const Header = ({
  title,
  open,
  toggle,
}: {
  title?: string | ReactNode;
  open: any;
  toggle: any;
}) => {
  const router = useRouter();
  const data = useRecoilValue(profileState);
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);
  const [, setProfileState] = useRecoilState(profileState);
  const [branch, setBranch] = useRecoilState(branchStateSession);
  const [, setNotificationState] = useRecoilState(notificationState);
  const [, setProvincesState] = useRecoilState(provinceState);
  const isPos = useRecoilValue(posRouterState);

  const phone = data?.data?.phone;

  const role = branch?.employeeDto?.employeeRole?.name;

  // firebase pushNotification
  // const messaging = getMessaging();
  // onMessage(messaging, (payload) => {
  //   console.log("Recived in-app notification", payload);
  //   const notificationTitle = payload.notification?.title;
  //   const notificationBody = payload.notification?.body;
  //   const link = payload.data?.link;

  //   toast(
  //     <div
  //       onClick={() => {
  //         if (link) {
  //           router.push(link);
  //         }
  //       }}
  //       className={`flex gap-2 justify-center items-center ${
  //         link ? "cursor-pointer" : ""
  //       }`}
  //     >
  //       <div className="my-auto">
  //         <Image src={Noti} alt="" height={24} width={24} />
  //       </div>
  //       <div className="flex flex-col gap-1">
  //         <p className="font-semibold">{notificationTitle}</p>
  //         <p>{notificationBody}</p>
  //       </div>
  //     </div>
  //   );
  // });

  // useEffect(() => {
  //   let messaging: any;

  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker.ready
  //       .then(() => {
  //         messaging = getMessaging();

  //         onMessage(messaging, (payload) => {
  //           console.log("Received in-app notification", payload);
  //           const notificationTitle = payload.notification?.title;
  //           const notificationBody = payload.notification?.body;
  //           const link = payload.data?.link;

  //           toast(
  //             <div
  //               onClick={() => {
  //                 if (link) {
  //                   router.push(link);
  //                 }
  //               }}
  //               className={`flex gap-2 justify-center items-center ${
  //                 link ? "cursor-pointer" : ""
  //               }`}
  //             >
  //               <div className="my-auto">
  //                 <Image src={Noti} alt="" height={24} width={24} />
  //               </div>
  //               <div className="flex flex-col gap-1">
  //                 <p className="font-semibold">{notificationTitle}</p>
  //                 <p>{notificationBody}</p>
  //               </div>
  //             </div>
  //           );
  //         });
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "Service Worker chưa sẵn sàng, không thể đăng ký messaging:",
  //           error
  //         );
  //       });
  //   }
  // }, [router]);

  const [formFilter, setFormFilter] = useState({
    phoneNumber: phone,
    page: 1,
    limit: 4,
    q: "",
    sort: "createdAt",
  });

  const {
    data: noti,
    isLoading,
    refetch,
  } = useQuery(["NOTIFICATION", formFilter], () => getNotification(formFilter));

  const {
    data: count,
    isLoading: isCounting,
    refetch: countRefecth,
  } = useQuery(["COUNT"], () => notiCount(), {
    refetchInterval: !isPos ? 5000 : false,
    onSuccess: (response) => {
      setNotificationState({
        total: response.data.unreadCount,
        invitation: response.data.unreadInvitationCount,
        expiration: response.data.unreadExpirationCount,
      });
    },
  });

  const { data: province } = useQuery(["PROVINCE"], () => getProvince(), {
    onSuccess: (response) => {
      setProvincesState(response?.data);
    },
  });

  const items = noti?.data?.content || [];

  const unseenIds = items
    .filter((item: any) => !item.isSeen)
    .map((item: any) => item.id);

  const { mutate: seenNotiMutation, isLoading: isSeening } = useMutation(
    (data) => seenNotification(data),
    {
      onSuccess() {
        refetch();
        countRefecth();
      },
      onError(err: any) {
        console.error(err.response?.data?.message);
      },
    }
  );

  const handlePopoverClose = () => {
    if (unseenIds.length > 0) {
      seenNotiMutation(unseenIds);
    }
  };

  const profile = data?.data;

  const logout = () => {
    clearToken();
    setBranch(null);

    setProfileState(null);
    setNotificationState(null);
    router.push("/auth/sign-in");
  };

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
    };

    i18next.on("languageChanged", handleLanguageChange);

    return () => {
      i18next.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "vi" ? "en" : "vi";
    i18next.changeLanguage(newLanguage).then(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("language", newLanguage);
      }
    });
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href={"/account-setup"}>
          <span className="header-menu_item">
            <Image src={UserIcon} alt="" />
            {t("accountSetup")}
          </span>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link href={"/package-management"}>
          <span className="header-menu_item">
            <Image src={WalletIcon} alt="" />
            {t("purchasePackage")}
          </span>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span className="header-menu_item">
          <Image src={NoteBookIcon} alt="" />
          {t("termsOfService")}
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span className="header-menu_item">
          <Image src={PavicyIcon} alt="" />
          {t("privacyPolicy")}
        </span>
      ),
    },
    {
      key: "5",
      label: (
        <Link href={"/online-support"}>
          <span className="header-menu_item">
            <Image src={HeadPhoneIcon} alt="" />
            {t("onlineSupport")}
          </span>
        </Link>
      ),
    },
    {
      key: "language-switcher",
      label: (
        <span
          onClick={toggleLanguage}
          className="header-menu_item cursor-pointer flex items-center gap-2"
        >
          <Image
            className="rounded-full"
            src={currentLanguage === "vi" ? VieIcon : EnIcon}
            width={28}
            height={28}
            alt="Language Icon"
          />
          {currentLanguage === "vi" ? t("vietnamese") : t("english")}
        </span>
      ),
    },
    {
      key: "logout",
      label: (
        <span
          onClick={logout}
          className="header-menu_item justify-center  text-red-500"
        >
          <Image src={LogoutIcon} alt="" />
          {t("logout")}
        </span>
      ),
    },
  ];

  return (
    <div
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      className="flex h-[104px] w-full items-center justify-between 2xs:px-2 sm:px-6 md:px-8 shadow-[0px_2px_4px_0px_rgba(255,255,255,0.5)]"
    >
      <div
        onClick={toggle}
        className="bg-[#fff] 2xs:ml-0 sm:ml-[-20px] cursor-pointer shadow-sm rounded-lg h-7 w-7 flex justify-center items-center p-1.5 border-[1px] border-[#f6f6f6]"
      >
        {open ? (
          <Image src={LeftArrow} height={16} width={16} />
        ) : (
          <Image src={RightArrow} height={16} width={16} />
        )}
      </div>
      <div className="flex items-center 2xs:gap-2 sm:gap-3 md:gap-5">

        <div
          onClick={() => router.push("/online-support")}
          className="2xs:w-[50px] 2xs:h-[50px] sm:w-[56px] sm:h-[56px] rounded-[50%] flex items-center bg-white justify-center cursor-pointer"
        >
          <Image src={HeadSet} alt="" />
        </div>
        <div className="2xs:w-[50px] 2xs:h-[50px] sm:w-[56px] sm:h-[56px] rounded-[50%] flex items-center bg-white justify-center cursor-pointer">
          <Popover
            content={
              <NotiPopover
                items={items}
                isLoading={isLoading}
                refetch={refetch}
              />
            }
            title="Thông báo mới nhận"
            placement="bottomRight"
            trigger="click"
            onOpenChange={(visible) => {
              if (visible) {
                refetch();
              } else {
                handlePopoverClose();
              }
            }}
          >
            <CustomBadge2 dot={!!count?.data?.unreadCount}>
              <Image src={Noti} alt="" />
            </CustomBadge2>
          </Popover>
        </div>
        <div className="w-[32px] border-[1px] rotate-[-90deg] border-[#B2B2B2] 2xs:hidden md:block"></div>
        <CustomBadge dot>
          {isColorAvatar(profile?.avatar) ? (
            <div
              style={{ backgroundColor: profile?.avatar }}
              className="!w-[64px] !h-[64px] rounded-full"
            ></div>
          ) : (
            <Image
              className="!w-[64px] !h-[64px] bg-[#4285F4] rounded-full object-center object-cover"
              width={64}
              height={64}
              src={getValidImageUrl(profile?.avatar)}
            />
          )}
        </CustomBadge>
        <div className="flex gap-2">
          <div className="flex 2xs:flex-col sm:flex-row">
            <div className="flex flex-col mr-2">
              <span className="cursor-pointer 2xs:text-[18px] md:text-[24px] font-semibold">
                {profile ? profile?.name : "Khách"}
              </span>
              <span className="text-[#666]">#{profile?.id}</span>
            </div>
            {branch && <CustomButton type="link">{role}</CustomButton>}
          </div>

          <Dropdown
            overlay={<CustomDropDown items={profileItems} />}
            trigger={["click"]}
          >
            <Space>
              <Image className="cursor-pointer" src={DropdownIcon} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

const CustomBadge = styled(Badge)`
  .ant-badge-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: green;
    border: 2px solid #ffffff;
    right: 10px;
    top: 56px;
  }
`;

const CustomBadge2 = styled(Badge)`
  .ant-badge-dot {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #dc3545;
    border: 2px solid #f7f0f8;
    right: 10px;
    top: 8px;
  }
`;

const CustomDropDown = styled(Menu)`
  background: #fff !important;
  padding: 10px 15px !important;
  width: 300px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -19px;
    right: 15px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    z-index: 1;
  }
`;

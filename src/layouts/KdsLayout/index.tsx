import { ReactNode, useEffect } from "react";

import Image from "next/image";
import Avatars from "@/assets/Avatar.svg";
import List from "@/assets/List.svg";
import LogoDoopPos from "@/assets/LogoDoopPos.svg";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "next/router";
import { Badge, Drawer, Dropdown, Menu, Popover, Space } from "antd";
import React, { useState } from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";
import DropdownIcon from "@/assets/dropdownIcon.svg";
import { setToken } from "@/helpers/storage";
import {
  branchStateSession,
  notificationState,
  profileState,
  provinceState,
} from "@/recoil/state";
import Notification from "@/assets/Notification.svg";
import UserIcon from "@/assets/UserCircle.svg";
import LogoutIcon from "@/assets/SignOut.svg";
import CloseKds from "@/assets/close-kds.svg";
import WalletIcon from "@/assets/Wallet.svg";
import NoteBookIcon from "@/assets/Notebook.svg";
import PavicyIcon from "@/assets/Pavicy.svg";
import HeadPhoneIcon from "@/assets/Headset.svg";
import PendingPaymentIcon from "@/assets/pending-payment.svg";
import Bar1Icon from "@/assets/Bar1.svg";
import BringServeIcon from "@/assets/serve.svg";

import styled from "styled-components";
import SideBar from "../SideBar";
import { getBar } from "@/api/kitchen.service";
import { useMutation, useQuery } from "@tanstack/react-query";
// import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import Noti from "@/assets/noti.svg";
import {
  getNotification,
  notiCount,
  seenNotification,
} from "@/api/notification.service";
import NotiPopover from "@/modules/noti-popover";

const content = (
  <div className="mt-2 w-[380px]">
    <p className="px-[12px] py-[30px]">....</p>
    <div className="w-full h-[0.5px] bg-[#ccc]"></div>
    <Link href="/">
      <p className=" h-[32px] flex py-[25px] items-center justify-center w-[100%] font-medium  leading-[24px] text-custom-orange hover:no-underline text-center cursor-pointer">
        Xem tất cả
      </p>
    </Link>
  </div>
);

type ILayoutProps = {
  meta: ReactNode;
  title?: string | ReactNode;
  children: ReactNode;
};

type MenuItem = {
  key: string;
  label: React.ReactNode;
};

export default function KdsLayout(props: ILayoutProps) {
  const [selectedMenu, setSelectedMenu] = useState<string>("CHẾ BIẾN BẾP");
  const [branch, setBranch] = useRecoilState(branchStateSession);
  const [open, setOpen] = useState(false);
  const data = useRecoilValue(profileState);
  const router = useRouter();
  const [, setNotificationState] = useRecoilState(notificationState);
  const [, setProvincesState] = useRecoilState(provinceState);

  const phone = data?.data?.phone;

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

  const [formFilterBar, setFormFilterBar] = useState({
    branchId: branch?.id,
    keyword: "",
  });

  const { data: bars } = useQuery(["BAR", formFilterBar], () =>
    getBar(formFilterBar)
  );

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
    refetchInterval: 5000,
    onSuccess: (response) => {
      setNotificationState({
        total: response.data.unreadCount,
        invitation: response.data.unreadInvitationCount,
        expiration: response.data.unreadExpirationCount,
      });
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

  const logout = () => {
    setBranch(null);
    setToken("");
    router.push("/auth/sign-in");
  };

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link href={"/account-setup"}>
          <span className="header-menu_item">
            <Image src={UserIcon} alt="" />
            Thiết lập tài khoản
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
            Quản lý gói mua
          </span>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span className="header-menu_item">
          <Image src={NoteBookIcon} alt="" />
          Điều khoản dịch vụ
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span className="header-menu_item">
          <Image src={PavicyIcon} alt="" />
          Chính sách bảo mật
        </span>
      ),
    },
    {
      key: "5",
      label: (
        <span className="header-menu_item">
          <Image src={HeadPhoneIcon} alt="" />
          Hỗ trợ trực tuyến
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
          Đăng xuất
        </span>
      ),
    },
  ];

  useEffect(() => {
    const isBringServe = router.query["bring-serve"] !== undefined;
    const isPendingPayment = router.query["pending-payment"] !== undefined;
    const barId = router.query.barId;

    if (isPendingPayment) {
      setSelectedMenu("Chờ thanh toán");
    } else if (barId) {
      const bar = bars?.data?.find((item: any) => item.id === Number(barId));

      setSelectedMenu(bar ? `Chờ chế biến ${bar.name}` : "CHẾ BIẾN BẾP");
    } else if (isBringServe) {
      setSelectedMenu("Mang phục vụ");
    } else {
      setSelectedMenu("CHẾ BIẾN BẾP");
    }
  }, [router.query, bars]);

  const barItems =
    bars?.data?.map((bar) => ({
      key: `bar-${bar.id}`,
      label: (
        <div
          className="flex gap-[15px] items-center cursor-pointer"
          onClick={() => router.push(`kds/?barId=${bar.id}`)}
        >
          <Image src={Bar1Icon} alt="" />
          <span className="">{`Chờ chế biến ${bar.name}`}</span>
        </div>
      ),
    })) || [];

  const menuItems: MenuItem[] = [
    {
      key: "1",
      label: (
        <div
          className="flex gap-[15px] cursor-pointer"
          onClick={() => router.push("/kds/?pending-payment")}
        >
          <Image src={PendingPaymentIcon} alt="" />
          <span className="header-menu_item">Chờ thanh toán</span>
        </div>
      ),
    },
    ...barItems,
    {
      key: "4",
      label: (
        <div
          className="flex gap-[15px] cursor-pointer"
          onClick={() => router.push("/kds/?bring-serve")}
        >
          <Image src={BringServeIcon} alt="" />
          <span className="header-menu_item">Mang phục vụ</span>
        </div>
      ),
    },
  ];

  const onMenuClick: MenuProps["onClick"] = (e) => {
    const clickedItem = menuItems.find((item: any) => item.key === e.key);
    if (clickedItem) {
      const labelElement = clickedItem.label;
      if (React.isValidElement(labelElement)) {
        const labelText = labelElement.props.children[1];
        setSelectedMenu(labelText);

        const key = e.key;
        if (key === "1") {
          router.push("/kds/?pending-payment");
        } else if (key.startsWith("bar-")) {
          const barId = key.replace("bar-", "");
          router.push(`/kds/?barId=${barId}`);
        } else if (key === "4") {
          router.push("/kds/?bring-serve");
        }
      }
    }
  };

  return (
    <div>
      {props.meta}
      <div className="flex grow flex-col">
        <div className="flex h-[78px] w-full items-center justify-between md:px-6 sm:px-3 shadow-[0px_2px_4px_0px_rgba(255,255,255,0.5)] border-b border-[#E4E4E4] bg-[rgba(255,255,255,0.5)]">
          <div className="flex items-center lg:gap-5 sm:gap-1 h-full lg:flex-1">
            <CustomButton
              type="icon"
              className="!rounded-full !w-[48px] !h-[48px] !min-w-[48px]"
              onClick={() => setOpen(true)}
            >
              <Image width={24} height={24} src={List} />
            </CustomButton>

            <Dropdown
              overlay={
                <CustomDropDown items={menuItems} onClick={onMenuClick} />
              }
              trigger={["click"]}
            >
              <Space>
                <div className="flex items-center gap-2">
                  <p className="text-[#FF5C00] font-bold text-md uppercase">
                    {selectedMenu}
                  </p>
                  <Image className="cursor-pointer" src={DropdownIcon} />
                </div>
              </Space>
            </Dropdown>
          </div>

          <div onClick={() => {
            if (branch && branch.id) {
              router.push(`/dashboard/${branch.id}`);
            } else {
              setBranch(null);
              router.push("/");
            }
          }} className="sm:hidden xl:block">
            <Image
              height={44}
              className="rounded-[50%] cursor-pointer"
              src={LogoDoopPos}
            />
          </div>

          <div className="flex items-center justify-end  sm:flex-1">
            <div className="!w-[45px] h-[45px] rounded-[50%] flex items-center bg-[#F2F2F2] justify-center cursor-pointer">
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
                  <Image src={Noti} alt="" width={35} height={35} />
                </CustomBadge2>
              </Popover>
            </div>

            <div className="w-[32px] border-[1px] rotate-[-90deg] mx-[5px] border-[#B2B2B2]"></div>

            <CustomBadge dot>
              <Image
                className="bg-[#4285F4] object-cover rounded-[50%]"
                src={Avatars}
                width={45}
                height={45}
              />
            </CustomBadge>

            <div className="flex ml-1">
              <div className="flex flex-col ml-2 mr-3">
                <Space>
                  <span className="cursor-pointer md:text-[18px] sm:text-[17px] mr-2 font-semibold whitespace-nowrap">
                    {data?.data?.name}
                  </span>
                  <CustomButton type="link" className="!rounded-[50px]">
                    Quản lý chuỗi
                  </CustomButton>
                </Space>
                <span className="text-[#666]">{data?.data?.id}</span>
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

          <Drawer onClose={() => setOpen(false)} open={open} placement="left">
            <SideBar pos={true} />
            <div
              className="absolute right-[-18px]  top-5 w-[40px] h-[40px] border-[1px] border-[#FBD7B5] bg-white flex justify-center cursor-pointer items-center rounded-full"
              onClick={() => setOpen(false)}
            >
              <Image className="cursor-pointer" src={CloseKds} />
            </div>
          </Drawer>
        </div>

        <div className="main-content grow">
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
}

const CustomBadge = styled(Badge)`
  .ant-badge-dot {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: green;
    border: 2px solid #ffffff;
    right: 8px;
    top: 41px;
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

  .ant-dropdown-menu-item {
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

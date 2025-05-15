import Image from "next/image";
import List from "@/assets/List.svg";
import ClockPos from "@/assets/ClockPos.svg";
import ServicesPos from "@/assets/service.svg";
import ClipboardText from "@/assets/BlackClipboardText.svg";
import MapTrifold from "@/assets/MapTrifold.svg";
import Noti from "@/assets/noti.svg";

import LogoDoopPos from "@/assets/LogoDoopPos.svg";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "next/router";
import { Badge, Drawer, Divider, Popover } from "antd";

import React, { CSSProperties, useCallback, useState } from "react";
import SideBar from "../SideBar";
import NotiPopover from "@/modules/pos/noti-popover";
import styled from "styled-components";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getNotification,
  notiCount,
  seenNotification,
} from "@/api/notification.service";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileState, posRouterState, branchStateSession } from "@/recoil/state";
import { getValidImageUrl, isColorAvatar } from "@/utils";

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

export const ROUTER_DIAGRAM_POS = "/pos/diagram"

export default function PostHeader() {
  const { formattedTime, formattedDate } = useCurrentTime();
  const [open, setOpen] = useState(false);
  const profile = useRecoilValue(profileState);
  const phone = profile?.data?.phone;
  const isPos = useRecoilValue(posRouterState);
  const [branch] = useRecoilState(branchStateSession);
  

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
    refetchInterval: isPos ? 5000 : false,
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

  const router = useRouter();

  const activeKey = router.pathname;
  const getMenuItemStyle = useCallback((key: string) => {
    if (key !== activeKey) return {};
    return {
      filter: "sepia(1)",
      mixBlendMode: "hard-light",
      backgroundColor: "#ff5c00"
    } as CSSProperties;
  }, [activeKey])

  const itemMenu = [
    {
      label: "Hóa đơn",
      key: "/pos/invoice",
      icon: <Image src={ClipboardText} style={getMenuItemStyle("/pos/invoice")} />,
    },
    {
      label: "Dịch vụ",
      key: "/pos/service",
      icon: <Image src={ServicesPos} style={getMenuItemStyle("/pos/service")} />,
    },
    {
      label: "Đặt bàn",
      key: "/pos/table",
      icon: <Image src={ClockPos} style={getMenuItemStyle("/pos/table")} />,
    },
    {
      label: "Khu vực",
      key: ROUTER_DIAGRAM_POS,
      icon: <Image src={MapTrifold} style={getMenuItemStyle("/pos/diagram")} />
    },
  ];

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        className="flex flex-shrink-0 h-[78px] w-full items-center justify-between px-8 shadow-[0px_2px_4px_0px_rgba(255,255,255,0.5)] border-b border-[#E4E4E4]"
      >
        <div className="flex items-center gap-5 h-full ">
          <CustomButton
            type="icon"
            className="!rounded-full !w-[48px] !h-[48px] !min-w-[48px]"
            onClick={showDrawer}
          >
            <Image width={24} height={24} src={List} />
          </CustomButton>
          <div className="w-[1px] h-[48px]  bg-[#E4E4E4]"></div>
          <Image
            height={44}
            className="rounded-[50%] cursor-pointer"
            src={LogoDoopPos}
            onClick={() => {
              if (!!branch && branch.id) {
                router.push(`/dashboard/${branch.id}`);
              } else {
                router.push("/");
              }
            }}
          />

          <div className="flex-1 h-full flex items-center ">
            {itemMenu?.map((item, index) => (
              <div
                className={`p-5 text-lg flex items-center gap-3 cursor-pointer ${
                  activeKey === item.key
                    ? "bg-[#FFF2E4] text-[#FF5C00] border-b-[4px] border-[#FF5C00] font-semibold"
                    : ""
                }`}
                onClick={() => handleMenuClick(item.key)}
              >
                <div className="flex items-center">{item.icon}</div>
                <p className="hidden lg:block font-semibold">{item?.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 ">
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
                <div className="rounded-full bg-[#F2F2F2] p-[10px]">
                  <Image src={Noti} alt="" height={36} width={36} />
                </div>
              </CustomBadge2>
            </Popover>
          </div>
          <Divider
            type="vertical"
            style={{
              backgroundColor: "#B2B2B2",
              width: "1.5px",
              height: "32px",
            }}
            className="-mx-2"
          />

          <div className="flex flex-col items-end ">
            <p className="text-2xl font-bold w-[107px]">{formattedTime}</p>
            <p className="mr-[2px]">{formattedDate}</p>
          </div>
          <div className="flex flex-shrink-0 h-12 w-12 rounded-full">
            {isColorAvatar(profile?.data?.avatar) ? (
              <div
                style={{ backgroundColor: profile?.data?.avatar }}
                className="!w-[64px] !h-[64px] rounded-full"
              ></div>
            ) : (
              <Image
                className="!w-[64px] !h-[64px] bg-[#4285F4] rounded-full object-center object-cover"
                width={64}
                height={64}
                src={getValidImageUrl(profile?.data?.avatar)}
              />
            )}
          </div>
        </div>
      </div>
      <Drawer onClose={onClose} open={open} placement="left">
        <SideBar pos={true} />
      </Drawer>
    </>
  );
}

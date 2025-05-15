import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { message, Skeleton } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { formatHours, getValidImageUrl, isColorAvatar } from "../../../utils";

import Warrning from "@/assets/Warning1.svg";
import SupportImg from "@/assets/images/Support.png";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import PackageActiveModal from "./PackageActiveModal";

import { seenNotification } from "@/api/notification.service";
import { getNotifiPackage } from "@/api/package.service";

const Notification = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const profile = useRecoilValue(profileState);
  const phone = profile?.data?.phone;
  const [actionType, setActionType] = useState<"renew" | "upgrade" | null>(
    null
  );

  const [selectedPackage, setSelectedPackage] = useState({
    branchId: "",
    branchName: "",
    packageId: "",
  });

  const [formFilter, setFormFilter] = useState({
    phoneNumber: phone,
    page: 1,
    limit: 10,
    sort: "createdAt",
  });

  const {
    data: notification,
    isLoading,
    refetch,
  } = useQuery(
    ["NOTIFICATION_PACKAGE", formFilter],
    () => getNotifiPackage(formFilter),
    { refetchOnWindowFocus: true }
  );

  const { mutate: seenNotiMutation } = useMutation(
    (data: any) => seenNotification(data),
    {
      onSuccess() {
        refetch();
      },
      onError(err: any) {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleSeenNoti = (id: any) => {
    const data = [id];
    seenNotiMutation(data);
  };

  const handleNotificationClick = (item, type) => {
    if (!item.isSeen) {
      handleSeenNoti(item.id);
    }

    setSelectedPackage({
      branchId: item?.params?.branchId,
      branchName: item?.params?.branchName,
      packageId: item?.params?.packageId,
    });
    setActionType(type);
    setOpen(true);
  };

  const groupNotificationsByDate = (notifications) => {
    const groups = notifications.reduce((acc, item) => {
      const dateObj = new Date(item.createdAt);
      const date = dateObj.toLocaleDateString();

      let displayDate = date;
      if (dateObj.toDateString() === new Date().toDateString()) {
        displayDate = "Hôm nay";
      } else if (
        dateObj.toDateString() === new Date(Date.now() - 864e5).toDateString()
      ) {
        displayDate = "Hôm qua";
      }

      if (!acc[displayDate]) {
        acc[displayDate] = [];
      }
      acc[displayDate].push(item);
      return acc;
    }, {});

    return groups;
  };

  const notificationsGroupedByDate = notification?.data?.content
    ? groupNotificationsByDate(notification?.data?.content)
    : {};

  return (
    <>
      <div className="p-6 bg-[#fff] rounded-[10px] shadow-md mb-6">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} className="mb-2" />
        ) : Object.keys(notificationsGroupedByDate).length === 0 ? (
          <>
            <div className="flex flex-col justify-center items-center my-12">
              <Image src={SupportImg} />
              <p className="px-3 mb-5 text-center text-[16px]">
                Không có thông báo gói mua nào!
              </p>
            </div>
          </>
        ) : (
          Object.entries(notificationsGroupedByDate).map(
            ([date, notifications]) => (
              <div key={date}>
                <h3 className="font-semibold text-[#1a1a1a] my-4 text-[18px]">
                  {date}
                </h3>
                {(notifications as any).map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-5 p-5 ${
                      item.isSeen === false ? "bg-[#FBF2F2]" : "bg-[#F9FAFD]"
                    } rounded-[16px] mb-4`}
                  >
                    <div>
                      <div className="h-[52px] w-[52px]">
                        {item.type === "EXPIRATION" ? (
                          <Image
                            src={Warrning}
                            height={52}
                            width={52}
                            alt="Cảnh báo"
                          />
                        ) : (
                          <>
                            {isColorAvatar(item?.params?.image) ? (
                              <div
                                key={item.id}
                                style={{ backgroundColor: item.params?.image }}
                                className="rounded-full h-[52px] w-[52px]"
                              ></div>
                            ) : (
                              <Image
                                src={getValidImageUrl(item?.params?.image)}
                                height={52}
                                width={52}
                                alt="Hình ảnh người dùng"
                                className="rounded-full object-cover object-center"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div>
                        <div className="flex justify-between w-full mb-1">
                          <div>
                            <h4 className="text-lg text-[#3355FF]">
                              {item?.title}
                            </h4>
                          </div>
                          <div className="flex gap-2 items-center">
                            {formatHours(item.createdAt)}{" "}
                            {!item.isSeen && (
                              <div className="w-2 h-2 bg-[#FF5C00] rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: item.content }} />
                      </div>

                      {item.type === "EXPIRATION" &&
                        item.isAction === false && (
                          <div className="flex gap-3 mt-2">
                            <CustomButton
                              type="primary"
                              wrapClassName="w-[120px]"
                              className="!h-[36px]"
                              onClick={() =>
                                handleNotificationClick(item, "renew")
                              }
                            >
                              {t("renewNow")}
                            </CustomButton>
                            <CustomButton
                              type="green-btn"
                              wrapClassName="w-[143px] "
                              className="!h-[36px]"
                              onClick={() =>
                                handleNotificationClick(item, "upgrade")
                              }
                            >
                              {t("upgradePurchasePackage")}
                            </CustomButton>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </div>

      <PackageActiveModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        branchId={selectedPackage.branchId}
        branchName={selectedPackage.branchName}
        packageId={selectedPackage.packageId}
        actionType={actionType}
      />
    </>
  );
};

export default Notification;

// 0337200126

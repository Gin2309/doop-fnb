import { useState } from "react";
import { Skeleton, message } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import { getValidImageUrl, isColorAvatar } from "../../utils";

import Avatars from "@/assets/Avatar.svg";
import SupportImg from "@/assets/images/Support.png";

import { formatHours } from "../../utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotification,
  notiAction,
  seenNotification,
} from "@/api/notification.service";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";

export default function AwaitingApprovalPage() {
  const { t } = useTranslation();
  const profile = useRecoilValue(profileState);
  const phone = profile?.data?.phone;
  const avatar = profile?.data?.avatar;
  const [formFilter, setFormFilter] = useState({
    phoneNumber: phone,
    type: "INVITATION",
    page: 1,
    limit: 10,
    q: "",
    sort: "createdAt",
  });

  const { data, isLoading, refetch } = useQuery(
    ["NOTIFICATION", formFilter],
    () => getNotification(formFilter),
    { refetchOnWindowFocus: true }
  );
  const queryClient = useQueryClient();

  const { mutate: actionMutation, isLoading: isActing } = useMutation(
    (data: any) => notiAction(data),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["BRANCH"]);
        refetch();
      },
      onError(err: any) {
        message.error(
          err.response?.data?.message || "Có lỗi xảy ra vui lòng thử lại",
          1
        );
      },
    }
  );

  const handleAction = ({
    id,
    phone,
    status,
    branchId,
    senderImage,
    receiverImage,
  }: {
    id: number;
    phone: string;
    status: string;
    branchId: number;
    senderImage: string;
    receiverImage: string;
  }) => {
    const data = {
      phone: phone,
      branchId: branchId,
      status: status,
      notificationId: id,
      senderImage: senderImage,
      receiverImage: receiverImage,
    };
    actionMutation(data);
  };

  const { mutate: seenNotiMutation, isLoading: isSeening } = useMutation(
    (data: any) => seenNotification(data),
    {
      onSuccess() {
        refetch();
      },
      onError(err: any) {
        console.error(err.response?.data?.message);
      },
    }
  );

  const handleSeenNoti = (id: any) => {
    const data = [id];
    seenNotiMutation(data);
  };

  const groupNotificationsByDate = (notifications: any) => {
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

  const notificationsGroupedByDate = data?.data?.content
    ? groupNotificationsByDate(data.data.content)
    : {};

  return (
    <>
      <CustomActionHeader title="awaitingApprovalTitle" type="title" />

      <div className="p-6 bg-[#fff] rounded-[10px] shadow-md mb-6">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} className="mb-2" />
        ) : Object.keys(notificationsGroupedByDate).length === 0 ? (
          <>
            <div className="flex flex-col justify-center items-center my-12">
              <Image src={SupportImg} />
              <p className="px-3 mb-5 text-center text-[16px]">
                Không có lời mời nào.
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
                    onClick={() => {
                      if (!item.isSeen) {
                        handleSeenNoti(item.id);
                      }
                    }}
                  >
                    <div>
                      {
                        <div className="h-[52px] w-[52px]">
                          {isColorAvatar(item.params?.image) ? (
                            <div
                              key={item.id}
                              style={{ backgroundColor: item.params?.image }}
                              className="rounded-full h-[52px] w-[52px]"
                            ></div>
                          ) : (
                            <Image
                              src={getValidImageUrl(item.params?.image)}
                              height={52}
                              width={52}
                              alt="Hình ảnh người dùng"
                              className="rounded-full"
                            />
                          )}
                        </div>
                      }
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div>
                        <div className="flex justify-between w-full mb-1">
                          <div>
                            <h4 className="text-lg text-[#3355FF]">
                              {item.title}
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

                      {item.type === "INVITATION" &&
                        item.isAction === false && (
                          <div className="flex gap-3 mt-2">
                            <CustomButton
                              outline={true}
                              type="original"
                              className="!h-[36px] px-5"
                              disabled={isActing}
                              onClick={() =>
                                handleAction({
                                  id: item.id,
                                  phone: item.phone,
                                  status: "CANCEL",
                                  branchId: Number(item.params?.branchId),
                                  senderImage: avatar,
                                  receiverImage: item.params?.image,
                                })
                              }
                            >
                              Từ chối
                            </CustomButton>
                            <CustomButton
                              type="primary"
                              className="!h-[36px] px-5"
                              disabled={isActing}
                              onClick={() =>
                                handleAction({
                                  id: item.id,
                                  phone: item.phone,
                                  status: "ACTIVE",
                                  branchId: Number(item.params?.branchId),
                                  senderImage: avatar,
                                  receiverImage: item.params?.image,
                                })
                              }
                            >
                              Chấp nhận
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

        {data?.data?.totalElements > 0 && (
          <CustomPagination
            page={formFilter.page}
            pageSize={formFilter.limit}
            setPage={(value) => setFormFilter({ ...formFilter, page: value })}
            setPerPage={(value) =>
              setFormFilter({ ...formFilter, limit: value })
            }
            total={data?.data?.totalElements}
          />
        )}
      </div>
    </>
  );
}

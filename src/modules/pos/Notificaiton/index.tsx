import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Skeleton, message } from "antd";

import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import { getValidImageUrl, isColorAvatar } from "@/utils";
import { groupNotificationsByDate } from "@/modules/notification/component";
import PackageActiveModal from "@/modules/package-management/Notification/PackageActiveModal";
import BillButton from "@/modules/notification/component/BillButton";
import ItemButton from "@/modules/notification/component/ItemButton";

import Warrning from "@/assets/Warning1.svg";
import SupportImg from "@/assets/images/Support.png";

import { formatHours } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotification,
  notiAction,
  seenNotification,
} from "@/api/notification.service";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";

export default function PosNoti() {
  const { t } = useTranslation();
  const profile = useRecoilValue(profileState);
  const phone = profile?.data?.phone;
  const [open, setOpen] = useState(false);
  const avatar = profile?.data?.avatar;
  const [actionType, setActionType] = useState<"renew" | "upgrade" | null>(
    null
  );
  const [formFilter, setFormFilter] = useState({
    phoneNumber: phone,
    page: 1,
    limit: 10,
    q: "",
    sort: "createdAt",
  });

  const [selectedPackage, setSelectedPackage] = useState({
    branchId: "",
    branchName: "",
    packageId: "",
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
          err.response?.data?.message || "Có lỗi xảy ra vui lòng thử lại"
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

  const handleButtonClick = (item: any, status: string) => {
    handleSeenNoti(item.id);

    handleAction({
      id: item.id,
      phone: item.phone,
      status: status,
      branchId: Number(item.params?.branchId),
      senderImage: avatar,
      receiverImage: item.params?.image,
    });
  };

  const notificationsGroupedByDate = data?.data?.content
    ? groupNotificationsByDate(data.data.content)
    : {};

  return (
    <>
      <div className="p-6 bg-[#fff] rounded-[10px] shadow-md mb-6">
        <h1 className="text-2xl font-semibold mb-6">Danh sách thông báo </h1>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} className="mb-2" />
        ) : Object.keys(notificationsGroupedByDate).length === 0 ? (
          <>
            <div className="flex flex-col justify-center items-center my-12">
              <Image src={SupportImg} />
              <p className="px-3 mb-5 text-center text-[16px]">
                Không có thông báo nào.
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
                      {item.type === "EXPIRATION" ? (
                        <div className="h-[52px] w-[52px]">
                          <Image
                            src={Warrning}
                            height={52}
                            width={52}
                            alt="Cảnh báo"
                          />
                        </div>
                      ) : (
                        <div className="h-[52px] w-[52px]">
                          {(() => {
                            let imageSource: any;

                            if (
                              ["ACCEPTANCE_OWNER", "REJECTION_OWNER"].includes(
                                item.type
                              )
                            ) {
                              imageSource = item.params?.receiverImage;
                            } else if (
                              ["REJECTION", "ACCEPTANCE"].includes(item.type)
                            ) {
                              imageSource = item.params?.senderImage;
                            } else {
                              imageSource = item.params?.image;
                            }

                            return isColorAvatar(imageSource) ? (
                              <div
                                key={item.id}
                                style={{ backgroundColor: imageSource }}
                                className="rounded-full h-[52px] w-[52px]"
                              ></div>
                            ) : (
                              <Image
                                src={getValidImageUrl(imageSource)}
                                height={52}
                                width={52}
                                alt="Hình ảnh người dùng"
                                className="rounded-full object-cover object-center"
                              />
                            );
                          })()}
                        </div>
                      )}
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

                      {item.type === "INVITATION" &&
                        item.isAction === false && (
                          <div className="flex gap-3 mt-2">
                            <CustomButton
                              outline={true}
                              type="original"
                              className="!h-[36px] px-5"
                              disabled={isActing}
                              onClick={() => handleButtonClick(item, "CANCEL")}
                            >
                              Từ chối
                            </CustomButton>
                            <CustomButton
                              type="primary"
                              className="!h-[36px] px-5"
                              disabled={isActing}
                              onClick={() => handleButtonClick(item, "ACTIVE")}
                            >
                              Chấp nhận
                            </CustomButton>
                          </div>
                        )}

                      {item.type === "CANCEL_CURRENT_BILL_REQUEST" &&
                        item.isAction === false && (
                          <BillButton
                            item={item}
                            refetch={refetch}
                            handleSeenNoti={handleSeenNoti}
                          />
                        )}

                      {item.type === "CANCEL_CURRENT_BILL_ITEM_REQUEST" &&
                        item.isAction === false && (
                          <ItemButton
                            item={item}
                            refetch={refetch}
                            handleSeenNoti={handleSeenNoti}
                          />
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

        <PackageActiveModal
          isOpen={open}
          onCancel={() => setOpen(false)}
          branchId={selectedPackage.branchId}
          branchName={selectedPackage.branchName}
          packageId={selectedPackage.packageId}
          actionType={actionType}
        />
      </div>
    </>
  );
}

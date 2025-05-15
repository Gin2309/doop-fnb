import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { message, Skeleton } from "antd";
import { CustomButton } from "@/components/CustomButton";
import { getValidImageUrl, isColorAvatar } from "@/utils";
import BillButton from "@/modules/notification/component/BillButton";
import ItemButton from "@/modules/notification/component/ItemButton";

import Warrning from "@/assets/Warning1.svg";
import Avatars from "@/assets/Avatar.svg";
import Wallet from "@/assets/Wallet1.svg";

import { notiAction } from "@/api/notification.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import PackageActiveModal from "@/modules/package-management/Notification/PackageActiveModal";

const NotiPopover = ({
  items,
  isLoading,
  refetch,
}: {
  items: any[];
  isLoading: boolean;
  refetch: any;
}) => {
  const { t } = useTranslation();
  const profile = useRecoilValue(profileState);
  const avatar = profile?.data?.avatar;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState({
    branchId: "",
    branchName: "",
    packageId: "",
  });
  const [actionType, setActionType] = useState<"renew" | "upgrade" | null>(
    null
  );

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

  const handleNotificationClick = (item, type) => {
    setSelectedPackage({
      branchId: item?.params?.branchId,
      branchName: item?.params?.branchName,
      packageId: item?.params?.packageId,
    });
    setActionType(type);
    setOpen(true);
  };

  return (
    <div className="my-2 w-[384px]">
      {isLoading ? (
        <>
          <Skeleton active paragraph={{ rows: 4 }} className="mb-2 px-4" />
        </>
      ) : items?.length === 0 ? (
        <p className="px-[12px] mb-5 text-center">Không có thông báo nào.</p>
      ) : (
        items?.map((item: any) => (
          <div
            key={item.id}
            className={`flex gap-2.5 p-4 ${
              item.isSeen === false ? "bg-[#FBF2F2] " : " bg-[fff]"
            }`}
          >
            <div>
              {item.type === "EXPIRATION" ? (
                <div className="h-[52px] w-[52px]">
                  <Image src={Warrning} height={52} width={52} alt="Cảnh báo" />
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

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-[#242424]">{item.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: item.content }} />
              {item.type === "EXPIRATION" && item.isAction === false && (
                <div className="flex gap-3 mt-2">
                  <CustomButton
                    type="primary"
                    wrapClassName="w-[120px]"
                    className="!h-[36px]"
                    onClick={() => handleNotificationClick(item, "renew")}
                  >
                    {t("renewNow")}
                  </CustomButton>
                  <CustomButton
                    type="green-btn"
                    wrapClassName="w-[143px] "
                    className="!h-[36px]"
                    onClick={() => handleNotificationClick(item, "upgrade")}
                  >
                    {t("upgradePurchasePackage")}
                  </CustomButton>
                </div>
              )}

              {item.type === "INVITATION" && item.isAction === false && (
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

              {item.type === "CANCEL_CURRENT_BILL_REQUEST" &&
                item.isAction === false && (
                  <BillButton item={item} refetch={refetch} />
                )}

              {item.type === "CANCEL_CURRENT_BILL_ITEM_REQUEST" &&
                item.isAction === false && (
                  <ItemButton item={item} refetch={refetch} />
                )}
            </div>
          </div>
        ))
      )}
      <div className="w-full h-[0.5px] bg-[#ccc]"></div>
      <Link href="/pos/notification">
        <p className="h-[32px] flex py-[25px] items-center justify-center w-[100%] font-medium leading-[24px] text-custom-orange hover:no-underline text-center cursor-pointer">
          Xem tất cả
        </p>
      </Link>

      <PackageActiveModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        branchId={selectedPackage.branchId}
        branchName={selectedPackage.branchName}
        packageId={selectedPackage.packageId}
        actionType={actionType}
      />
    </div>
  );
};

export default NotiPopover;

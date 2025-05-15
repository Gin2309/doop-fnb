import { CustomCardItem } from "@/components/CustomCardItem";
import { formatCurrency, isColorAvatar } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Waiter from "@/assets/Waiter.svg";
import ShareNetwork from "@/assets/ShareNetwork.svg";
import Pos from "@/assets/Pos.svg";
import Package from "@/assets/PackageButton.svg";
import Dollar from "@/assets/Dollar.svg";
import Fingerprint from "@/assets/Fingerprint.svg";
import BarChartHome from "./BarChartHome";
import { CustomButton } from "@/components/CustomButton";
import LineChartHome from "./LineChartHome";
import PenIcon from "@/assets/penIcon.svg";
import { useState } from "react";
import AddEmployee from "../employees/list/components/AddEmployee";
import PackageActiveModal from "../package-management/Notification/PackageActiveModal";
import LogoutIcon from "@/assets/SignOut.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveBranch } from "@/api/branch.service";
import { message } from "antd";
import CustomNotiAction from "@/components/CustomNotiAction/CustomNotiAction";
import { useRecoilState } from "recoil";
import { branchStateSession } from "@/recoil/state";

export function MainItem({
  item,
  status,
}: {
  item: any;
  status: "ACTIVE" | "INACTIVE";
}) {
  const { t } = useTranslation();
  const [openForm, setOpenForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<"renew" | "upgrade" | null>(
    null
  );
  const [_branch, setBranch] = useRecoilState(branchStateSession);

  const [branchIdLeave, setBranchIdLeave] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState({
    branchId: "",
    branchName: "",
    packageId: "",
  });

  const [showLeaveBranch, setShowLeaveBranch] = useState({
    visible: false,
    content: "",
  });

  const router = useRouter();

  const handleNotificationClick = (item, type) => {
    setSelectedPackage({
      branchId: item?.id,
      branchName: item?.params?.branchName,
      packageId: item?.params?.packageId,
    });
    setActionType(type);
    setOpen(true);
  };

  const queryClient = useQueryClient();

  const { mutate: mutateLeaveBranch, isLoading: isLoadingDelete } = useMutation(
    () => {
      return leaveBranch({ branchId: branchIdLeave });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["BRANCH"]);
        setShowLeaveBranch({
          visible: false,
          content: "",
        });
        message.success("Rời chi nhánh thành công!");
      },
      onError: (err: any) => {
        const errorMessage =
          err.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        message.error(errorMessage);
      },
    }
  );

  const handleLeaveBranch = () => {
    mutateLeaveBranch();
  };

  return (
    <>
      <CustomCardItem className="p-5">
        <div className="mx-3">
          <div className="flex flex-col xl:flex-row  justify-between xl:items-center gap-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {item.avatarUrl ? (
                  isColorAvatar(item.avatarUrl) ? (
                    <div
                      className="w-[80px] h-[80px] rounded-lg"
                      style={{
                        backgroundColor: item.avatarUrl,
                      }}
                    />
                  ) : (
                    <Image
                      width={80}
                      height={80}
                      className="rounded-lg object-cover object-center"
                      alt="cafe"
                      src={item.avatarUrl || "/images/services1.png"}
                    />
                  )
                ) : (
                  <div className="w-[80px] h-[80px] rounded-lg bg-gray-200 flex justify-center items-center font-semibold">
                    No image
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-base font-light text-[#333333]">
                    {t("openInvoice")}:{" "}
                    <span className="font-bold text-lg">16</span>
                    /28
                  </p>
                  <p className="text-base font-light text-[#333333]">
                    {t("employeeWorking")}:{" "}
                    <span className="font-bold text-lg">7</span>/8
                  </p>
                </div>
              </div>
              <div className="xl:hidden flex mb-3  justify-end gap-2">
                {item?.employeeDto?.employeeRole?.isAdmin && (
                  <CustomButton
                    type="original"
                    prefixIcon={<Image src={PenIcon} />}
                    onClick={() => router.push(`dashboard/form/${item.id}`)}
                  >
                    {t("edit")}
                  </CustomButton>
                )}
                <CustomButton
                  type="danger"
                  prefixIcon={<Image src={LogoutIcon} />}
                  className="!bg-white text-[#EF6060] border-[#EF6060]"
                  onClick={() => {
                    setShowLeaveBranch({
                      visible: true,
                      content: `Bạn muốn rời khỏi chi nhánh ${item?.name}`,
                    });
                    setBranchIdLeave(item?.id);
                  }}
                >
                  {t("leaveBranch")}
                </CustomButton>
              </div>
            </div>
            {status === "ACTIVE" && (
              <div>
                <div className="hidden xl:flex mb-3  justify-end gap-2">
                  {item?.employeeDto?.employeeRole?.isAdmin && (
                    <CustomButton
                      type="original"
                      prefixIcon={<Image src={PenIcon} />}
                      onClick={() => router.push(`dashboard/form/${item.id}`)}
                    >
                      {t("edit")}
                    </CustomButton>
                  )}
                  <CustomButton
                    type="danger"
                    prefixIcon={<Image src={LogoutIcon} />}
                    className="!bg-white text-[#EF6060] border-[#EF6060]"
                    onClick={() => {
                      setShowLeaveBranch({
                        visible: true,
                        content: `Bạn muốn rời khỏi chi nhánh ${item?.name}`,
                      });
                      setBranchIdLeave(item?.id);
                    }}
                  >
                    {t("leaveBranch")}
                  </CustomButton>
                </div>
                <div className="flex gap-2">
                  <CustomButton
                    type="icon"
                    onClick={() => {
                      setBranch(item);
                      router.push(`/pos/diagram`);
                      // router.push(`/pos/diagram?id=${item?.id}`)
                    }}
                  >
                    <Image src={Pos} /> POS
                  </CustomButton>
                  <CustomButton
                    type="icon"
                    onClick={() => {
                      setBranch(item);
                      router.push(`/kds`);
                      // router.push(`/kds?id=${item?.id}`)
                    }}
                  >
                    <Image src={Waiter} /> CB.PV
                  </CustomButton>
                  <CustomButton
                    type="icon"
                    onClick={() =>
                      router.push(`/inventory/inventory-stock?id=${item?.id}`)
                    }
                  >
                    <Image src={Package} /> Kho
                  </CustomButton>
                  <CustomButton
                    type="icon"
                    onClick={() =>
                      router.push(`/cashbooks/receipt?id=${item?.id}`)
                    }
                  >
                    <Image src={Dollar} /> Quỹ
                  </CustomButton>
                  <CustomButton
                    type="icon"
                    onClick={() =>
                      router.push(`/employees/timesheet?id=${item?.id}`)
                    }
                  >
                    <Image src={Fingerprint} /> Công
                  </CustomButton>
                  <CustomButton type="icon" onClick={() => setOpenForm(true)}>
                    <Image src={ShareNetwork} /> Mời
                  </CustomButton>
                </div>
              </div>
            )}

            {status === "INACTIVE" && (
              <div className="flex gap-2 items-center">
                <p className="text-[#E50000] text-lg font-semibold">
                  Chi nhánh bị khóa do gói mua phần mềm hết hạn
                </p>
                <CustomButton
                  type="primary"
                  onClick={() => handleNotificationClick(item, "renew")}
                >
                  Gia hạn ngay bây giờ
                </CustomButton>
              </div>
            )}
          </div>
          {status === "ACTIVE" && (
            <div>
              <div className="flex flex-col  gap-2 my-10">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold">Báo cáo thu chi</p>
                  <p
                    className="text-lg text-[#FF5C00] font-bold cursor-pointer"
                    onClick={() => router.push(`/dashboard/${item.id}`)}
                  >
                    {t("viewDetails")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <BarChartHome />
                <LineChartHome />
              </div>
            </div>
          )}
        </div>
      </CustomCardItem>
      <AddEmployee
        item={item}
        isOpen={openForm}
        onCancel={() => setOpenForm(false)}
      />

      {showLeaveBranch && (
        <CustomNotiAction
          isVisible={showLeaveBranch.visible}
          setIsVisible={setShowLeaveBranch}
          title="Bạn có chắc chắn muốn rời?"
          content={showLeaveBranch.content}
          type="warn"
          titleSubmit="Xác nhận"
          onSubmit={handleLeaveBranch}
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
    </>
  );
}

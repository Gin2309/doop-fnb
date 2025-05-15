import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { schema } from "./schema";
import RenewModal from "./RenewModal";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import CloseCircleGrayIcon from "@/assets/close.svg";
import { getPackage } from "@/api/package.service";

const durationTranslations = {
  DAY: "ngày",
  MONTH: "tháng",
  YEAR: "năm",
};

const PackageActiveModal = ({
  isOpen,
  onCancel,
  branchId,
  packageId,
  branchName,
  isLoading,
  actionType,
}: {
  isOpen: boolean;
  onCancel: () => void;
  branchId: string | any;
  packageId: string | any;
  branchName: string | any;
  isLoading?: boolean;
  actionType: "renew" | "upgrade" | null;
}) => {
  const { t } = useTranslation();
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );
  const [selectedPackageName, setSelectedPackageName] = useState<number | null>(
    null
  );
  const [selectedPackageprice, setSelectedPackagePrice] = useState<
    number | null
  >(null);

  const { data: packages } = useQuery(["LIST_PACKAGE"], () => getPackage(), {
    keepPreviousData: true,
    staleTime: 5000,
  });

  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (actionType === "renew" && packageId) {
      const packageExists = packages?.data?.find(
        (item) => item.id === packageId
      );
      if (packageExists) {
        setValue("packageId", packageId);
        setSelectedPackageId(packageId);
        setSelectedPackageName(packageExists.name);
        setSelectedPackagePrice(packageExists.price);
      }
    }
  }, [actionType, packageId, packages, setValue]);

  const handleFormSubmit = (data: any) => {
    setSelectedPackageId(data.packageId);
    const selectedPackage = packages?.data?.find(
      (item) => item.id === data.packageId
    );
    setSelectedPackageName(selectedPackage ? selectedPackage.name : null);
    setSelectedPackagePrice(selectedPackage ? selectedPackage?.price : null);
    setOpenPayment(true);
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      customFooter
      title={actionType === "renew" ? t("renewPackage") : "Nâng cấp gói mua"}
      width={750}
    >
      <div>
        <div className="text-start flex-1">
          <Label infoText="" label="Chọn gói mua" />
          <Controller
            name="packageId"
            control={control}
            render={({ field }) => (
              <div className="mb-4 custom-select-wrapper">
                <CustomSelect
                  options={packages?.data?.map((item) => ({
                    label: (
                      <div className=" flex justify-between py-1 px-2 items-center">
                        <div className="flex flex-col">
                          <span className="option-name">{item.name}</span>
                          <span className="text-[#FF5C00] text-[14px]">
                            Thời hạn sử dụng:{" "}
                            {`${item?.duration} ${
                              durationTranslations[item?.durationType] ||
                              item?.durationType
                            }`}
                          </span>
                        </div>
                        <span className="option-price">{`${item?.price?.toLocaleString()} VND`}</span>
                      </div>
                    ),
                    value: item.id,
                    name: item.name,
                  }))}
                  {...field}
                  showSearch={true}
                  className="suffix-icon h-11 !rounded"
                  placeholder="Tìm kiếm gói mua"
                />
              </div>
            )}
          />
        </div>
        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            type="original"
            onClick={onCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            disabled={isLoading}
            className="!h-11 !w-[120px]"
            onClick={handleSubmit(handleFormSubmit)}
            type="primary"
          >
            {t("save")}
          </CustomButton>
        </div>
      </div>

      <RenewModal
        isOpen={openPayment}
        onClose={onCancel}
        onCancel={() => setOpenPayment(false)}
        onSubmit={() => setOpenPayment(false)}
        packageId={selectedPackageId}
        packageName={selectedPackageName}
        packagePrice={selectedPackageprice}
        branchId={branchId}
      />
    </CustomModal>
  );
};

export default PackageActiveModal;

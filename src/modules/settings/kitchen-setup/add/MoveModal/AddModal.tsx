import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { CustomRadio } from "@/components/CustomRadio";

import CloseCircleGrayIcon from "@/assets/close.svg";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getBar, switchBar } from "@/api/kitchen.service";
import { message } from "antd";

const MoveModal = ({
  isOpen,
  onCancel,
  branchId,
  Ids,
  onRemove,
}: {
  isOpen: boolean;
  onCancel: () => void;
  branchId: number;
  Ids: any;
  onRemove: any;
}) => {
  const { t } = useTranslation();
  const [barId, setBarId] = useState(null);
  const [formFilter, setFormFilter] = useState({
    branchId: branchId,
  });

  const { data } = useQuery(["BAR", formFilter], () => getBar(formFilter));

  const { mutate: switchMutation, isLoading } = useMutation(
    (data: any) => switchBar(data),
    {
      onSuccess: () => {
        message.success("Chuyển bar/bếp thành công!");
        setBarId(null);
        onRemove(Ids);
        onCancel();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    const submittedData = {
      productIds: Ids,
      barToId: barId,
      branchId: branchId,
    };

    switchMutation(submittedData);
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="Close Icon" />}
      isOpen={isOpen}
      onCancel={onCancel}
      customFooter
      title="Chuyển mặt hàng tới bếp khác"
    >
      <div>
        <div className="flex flex-col gap-6 mb-6">
          <CustomRadio
            options={data?.data?.map((items) => ({
              value: items.id,
              label: items.name,
            })) ?? []}
            value={barId}
            onChange={(value) => {
              setBarId(value);
            }}
            gap={8}
            direction="vertical"
          />
        </div>

        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline
            className="!h-11 !w-[120px]"
            type="original"
            onClick={onCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            className="!h-11 !w-[120px]"
            onClick={onSubmit}
            isLoading={isLoading}
            type="primary"
          >
            {t("switchKitchen")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default MoveModal;

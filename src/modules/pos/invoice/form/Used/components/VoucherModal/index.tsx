import React, { useState } from "react";

import { CustomModal } from "@/components/CustomModal";
import { CustomButton } from "@/components/CustomButton";
import { CustomRadio } from "@/components/CustomRadio";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { formatMoney } from "@/helpers";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getVouchers } from "@/api/voucher.service";
import { addDiscountItemCurrentBill } from "@/api/current-bill-item.service";
import { message } from "antd";

const VoucherModal = ({
  isOpen,
  onCancel,
  currentBillId,
  refetch,
}: {
  isOpen: boolean;
  onCancel: () => void;
  currentBillId: number;
  refetch?: any;
}) => {
  const branch = useRecoilValue(branchStateSession);
  const [formFilter, setFormFilter] = useState({
    limit: 9999,
    page: 1,
    sort: "",
    branchId: branch?.id,
    voucherType: "",
  });
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);

  const { data } = useQuery(["VOUCHER", formFilter], () =>
    getVouchers(formFilter)
  );

  const { mutate: addMutation, isLoading } = useMutation(
    (data: any) => addDiscountItemCurrentBill(data),
    {
      onSuccess: () => {
        message.success("Thành công!");
        setSelectedVoucher(null);
        onCancel();
        refetch();
      },
      onError: (err: any) => {
        message.error(err.response?.data?.message);
      },
    }
  );

  const onSubmit = () => {
    if (selectedVoucher === null) {
      onCancel();
    }

    const selectedVoucherDetails = data?.data?.content.find(
      (item) => item.id === selectedVoucher
    );

    if (!selectedVoucherDetails) {
      message.error("Voucher không hợp lệ.");
      return;
    }

    const requestData = {
      currentBillId,
      value:
        selectedVoucherDetails.type === "AMOUNT"
          ? selectedVoucherDetails.discountValue
          : null,
      percent:
        selectedVoucherDetails.type === "PERCENT"
          ? selectedVoucherDetails.discountValue
          : null,
      type: "VOUCHER",
      branchId: branch.id,
    };

    addMutation(requestData);
  };

  const handleRadioChange = (value: number) => {
    setSelectedVoucher(value);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Khuyến mại"
      width={800}
      onSubmit={onSubmit}
      customFooter
    >
      <div>
        <CustomRadio
          onChange={(value) => handleRadioChange(Number(value))}
          options={data?.data?.content.map((item) => ({
            value: item.id,
            label: (
              <div className="flex justify-between w-full">
                <div>{item.name}</div>
                <div>
                  {item.type === "PERCENT"
                    ? `${item.discountValue}%`
                    : formatMoney(item.discountValue)}
                </div>
              </div>
            ),
          }))}
          gap={4}
          direction="vertical"
          value={selectedVoucher}
          className="discount-radio"
        />
      </div>
      <div className="flex justify-end w-full gap-4 pt-6">
        <CustomButton
          isLoading={isLoading}
          onClick={onSubmit}
          className="!h-11 !w-[120px]"
          type="primary"
        >
          Xác nhận
        </CustomButton>
      </div>
    </CustomModal>
  );
};

export default VoucherModal;

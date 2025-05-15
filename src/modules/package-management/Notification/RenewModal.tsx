import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import copy from "copy-to-clipboard";
import { message } from "antd";

import CloseCircleGrayIcon from "@/assets/close.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import QR from "@/assets/images/qrcode.png";
import { postPayment } from "@/api/package.service";
import { CustomInput } from "@/components/CustomInput";
import copyicon from "@/assets/copy.png";

import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { useRouter } from "next/router";

const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const formatName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
};

const RenewModal = ({
  isOpen,
  packageId,
  onCancel,
  onClose,
  onSubmit,
  branchId,
  packageName,
  packagePrice,
}: {
  isOpen: boolean;
  packageId: string | any;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  branchId: string | any;
  packageName: string | any;
  packagePrice: string | any;
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("Doop_chuquanganh_SĐT");
  const data = useRecoilValue(profileState);

  const router = useRouter();
  console.log("packagePrice", packagePrice);

  console.log("data:", data);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const randomCode = generateRandomCode();
      const formattedName = formatName(data?.data?.name);
      const description = `Doop_${formattedName}_${data?.data?.phone}`;
      setInputValue(description);
    }
  }, [data, isOpen]);

  const handeSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        recipientAccountNumber: "23710222",
        recipientName: "CHU THI DUNG",
        bankName: "MB",
        transferAmount: packagePrice,
        description: inputValue,
        branchId: branchId,
        packageId: packageId,
        packageName: packageName,
        paymentMethod: "Chuyển khoản",
        billCode: null,
        note: "Thanh toán hóa đơn",
      };
      await postPayment(payload);
      onSubmit();
      message.warning(
        "Yêu cầu của bạn đã được gửi. Vui lòng chờ chúng tôi xác nhận trong 1-3 ngày."
      );
      onCancel();
    } catch (error: any) {
      const errorMessage = error.response.data.message || "Thất bại";

      message.error(errorMessage);
    } finally {
      setLoading(false);
      onCancel();
      setTimeout(() => {
        onClose();
      }, 10);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleCopy = () => {
    copy(inputValue);
    message.success("Sao chép thành công!");
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handeSubmit}
      customFooter
      title={t("renewPackage")}
      width={750}
    >
      <div>
        <div className="grid gap-4 grid-cols-2 mb-6">
          <div className="p-4 gap-6 rounded-xl bg-[#fff] shadow-sm">
            <Image src={QR} alt="QR Code" />
          </div>
          <div className=" flex flex-col justify-center">
            <div className="bg-[#FDF7E7] mb-5 border-[1px] border-[#F29900] rounded-xl py-4 px-3">
              <p className="text-justify">
                Bạn vui lòng chuyển khoản chính xác nội dung chuyển tiền bên
                dưới hệ thống sẽ tự động cộng tiền cho bạn sau 1 - 5 phút sau
                khi nhận được tiền.
              </p>

              <p className="text-justify">
                Nếu sau 10 phút từ khi tiền trong tài khoản của bạn bị trừ mà
                tài khoản vẫn chưa được gia hạn, vui lòng liên hệ hotline
                01898956 để được hỗ trợ.
              </p>
            </div>

            <div className="bg-[#fff] shadow-md rounded-[15px] overflow-hidden p-2 flex  justify-between items-center">
              <div className="flex flex-col w-[90%]">
                <h1 className="text-[#8F90A6] text-[14px] ml-3">
                  Nội dung chuyển tiền
                </h1>
                <CustomInput
                  wrapClassName="accountNumber"
                  className="suffix-icon !rounded border-none "
                  placeholder="Nhập nội dung chuyển khoản"
                  value={inputValue}
                  onChange={(e: any) => setInputValue(e.target.value)}
                  readOnly={true}
                />
              </div>
              <div className="mr-1">
                <Image
                  src={copyicon}
                  onClick={handleCopy}
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-[100%] gap-[15px] pt-6 border-t-[1px] border-[#E5E5E5]">
          <CustomButton
            outline={true}
            className="!h-11 !w-[120px]"
            type="original"
            onClick={handleCancel}
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            disabled={loading}
            className="!h-11 !w-[120px]"
            onClick={handeSubmit}
            type="primary"
          >
            {t("save")}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default RenewModal;

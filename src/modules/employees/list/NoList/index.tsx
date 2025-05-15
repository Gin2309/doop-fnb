import { CustomCardItem } from "@/components/CustomCardItem";
import NoEmployee from "@/assets/NoEmployee.svg";
import Image from "next/image";
import PlusIcon from "@/assets/plusWhiteIcon.svg";

import { CustomButton } from "@/components/CustomButton";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Title from "@/components/Title";

export default function NoList({ setIsOpenAdd }) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      <CustomCardItem className="p-20 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-5">
          <div className="p-5">
            <Image src={NoEmployee} />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">Chưa có nhân viên nào</p>
            <p className="text-[#66666] mt-2">
              Thêm mới tài khoản nhân viên để vận hành nhà hàng thuận tiện hơn.
            </p>
          </div>

          <CustomButton
            type="primary"
            wrapClassName="inline-block"
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => setIsOpenAdd(true)}
          >
            {t("addEmployee")}
          </CustomButton>
        </div>
      </CustomCardItem>
    </>
  );
}

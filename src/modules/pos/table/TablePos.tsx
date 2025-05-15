import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import Image from "next/image";

import PlusIcon from "@/assets/PlusIconWhite.svg";
import { useTranslation } from "react-i18next";

import { DatePicker } from "antd";
import InvoicePosContent from "./TableContent";
import { CancelIcon } from "@/shared/icons/CancelIcon";
import TablePosContent from "./TableContent";
import { useRouter } from "next/router";


export default function TablePos({ data }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <Title>upcomingGuest</Title>
        <CustomButton
          onClick={() => router.push("/pos/table/form/add")}
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
        >
          {t("createTable")}
        </CustomButton>
      </div>

      <TablePosContent data={data} />
    </div>
  );
}

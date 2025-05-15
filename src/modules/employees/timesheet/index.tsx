import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import TableTimeSheet from "./TableTimeSheet";

const TimeSheet = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>timesheet</Title>

        <CustomButton
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push(`/employees/role/add`)}
        >
          {t("addRole")}
        </CustomButton>
      </div>
      <TableTimeSheet />
    </>
  );
};

export default TimeSheet;

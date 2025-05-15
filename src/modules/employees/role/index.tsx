import { CustomButton } from "@/components/CustomButton";
import Title from "@/components/Title";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import TableRole from "./TableRole";
import { useRouter } from "next/router";

const EmployeeRole = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>employeeRole</Title>

        <CustomButton
          type="primary"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push(`/employees/role/add`)}
        >
          {t("addRole")}
        </CustomButton>
      </div>

      <TableRole />
    </>
  );
};

export default EmployeeRole;

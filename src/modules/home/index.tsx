import { useTranslation } from "react-i18next";
import { MainContent } from "./MainContent";
import { CustomSelect } from "@/components/CustomSelect";
import Image from "next/image";
import CalendarBlankOrange from "@/assets/CalendarBlankOrange.svg";
import { DatePicker } from "antd";
import { CustomButton } from "@/components/CustomButton";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import PlusOrangeIcon from "@/assets/plusOrangeIcon.svg";
import { useRouter } from "next/router";
import { useState } from "react";
import FormBranchChain from "./FormBranchChain";
import { useQuery } from "@tanstack/react-query";
import { getBranch } from "@/api/branch.service";

const { RangePicker } = DatePicker;

export function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [openFormBranchChain, setOpenFormBranchChain] = useState(false);

  const { data: branches } = useQuery(["BRANCH"], () =>
    getBranch({
      limit: 99999,
      page: 1,
    })
  );

  const branchData = branches?.data?.content?.reduce((acc, branch) => {
    const branchChainId = branch.branchChain?.id || "other";
    const branchChainName = branch.branchChain?.name || "Chưa phân loại";
    let existingChain = acc.find((item) => item.id === branchChainId);
    if (existingChain) {
      existingChain.children.push(branch);
    } else {
      acc.push({
        id: branchChainId,
        name: branchChainName,
        children: [branch],
      });
    }

    return acc;
  }, []);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between">
          <div className="flex gap-3">
            {branchData?.length > 0 && (
              <>
                <CustomButton
                  type="primary"
                  wrapClassName="mx-2"
                  prefixIcon={<Image src={PlusIcon} />}
                  onClick={() => router.push("/dashboard/form/add")}
                >
                  {t("newBranch")}
                </CustomButton>

                <CustomButton
                  type="border-color"
                  wrapClassName="mx-2"
                  prefixIcon={<Image src={PlusOrangeIcon} />}
                  onClick={() => setOpenFormBranchChain(true)}
                >
                  {t("addNewBranchGroup")}
                </CustomButton>
              </>
            )}
          </div>
          <CustomSelect
            prefixIcon={
              <Image
                width={20}
                height={20}
                className="translate-y-[-1px] translate-x-[2px]"
                src={CalendarBlankOrange}
              />
            }
            className="h-11 "
            style={{
              width: "20%",
            }}
            options={[
              { label: "Tuần này", value: "week" },
              { label: "Tháng này", value: "month" },
              { label: "Năm này", value: "year" },
            ]}
            value="week"
          />
        </div>

        <MainContent
          branchData={branchData}
          setOpenFormBranchChain={setOpenFormBranchChain}
        />
      </div>
      <FormBranchChain
        isOpen={openFormBranchChain}
        onCancel={() => setOpenFormBranchChain(false)}
      />
    </>
  );
}

import { CustomButton } from "@/components/CustomButton";
import { CustomCardContent } from "@/components/CustomCardContent";
import { useTranslation } from "react-i18next";
import DashboardEmpty from "@/assets/DashboardEmpty.svg";
import PenIcon from "@/assets/penIcon.svg";
import Image from "next/image";
import { Col, Row } from "antd";

import { MainItem } from "./MainItem";
import { formatMoney } from "@/helpers";
import { useQuery } from "@tanstack/react-query";
import { getBranch } from "@/api/branch.service";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import PlusOrangeIcon from "@/assets/plusOrangeIcon.svg";
import { useRouter } from "next/router";

export function MainContent({ setOpenFormBranchChain, branchData }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <CustomCardContent>
      {branchData?.length > 0 ? (
        branchData?.map((item, index) => (
          <div className="p-10" key={index}>
            <div className="flex justify-between">
              <div className="flex flex-col xl:flex-row gap-2 xl:items-center ">
                <div className="flex gap-2 items-center ">
                  <div className="w-1 h-2/3 bg-[#F38820] rounded-lg"></div>
                  <div className="text-xl font-semibold">{item.name}</div>
                  <div className="w-1 h-1 bg-[#B2B2B2] rounded-full"></div>
                  <div className="text-[#3355ff] text-lg font-semibold">
                    {item?.children?.length} {t("branch")}
                  </div>
                </div>
                <div className="flex gap-2 items-center ">
                  <div className="w-1 h-1 bg-[#B2B2B2] rounded-full"></div>

                  <div className="text-lg font-semibold">
                    Tổng thu:{" "}
                    <span className="text-lg text-[#009933]">
                      {formatMoney(120000000)}
                    </span>{" "}
                    /
                  </div>

                  <div className="text-lg font-semibold">
                    Tổng chi:{" "}
                    <span className="text-lg text-[#E50000]">
                      {formatMoney(50000000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Row gutter={[30, 30]} className="mt-10">
              {item?.children?.map((item) => (
                <Col span={24}>
                  <MainItem item={item} status={item.status} />
                </Col>
              ))}
            </Row>
          </div>
        ))
      ) : (
        <div className="p-10 flex flex-col gap-3 items-center justify-center">
          <Image src={DashboardEmpty} />
          <p className="text-xl font-semibold">Bạn chưa thuộc chi nhánh nào</p>
          <div className="lg:flex justify-center 2xl:w-2/3">
            <div className="lg:border-r p-5 text-center text-lg mb-3">
              Nếu bạn là nhân viên, hãy yêu cầu quản lý chi nhánh gán số điện
              thoại của bạn vào danh sách nhân viên.
            </div>
            <div className="gap-3  p-5">
              <p className="text-center text-lg mb-3">
                Nếu bạn cần thiết lập mới một chi nhánh, hãy bắt đầu tạo chi
                nhánh đầu tiên nhé
              </p>
              <div className="flex gap-3 justify-center">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomCardContent>
  );
}

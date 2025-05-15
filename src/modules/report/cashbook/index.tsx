import { branchStateSession } from "@/recoil/state";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { formatTime } from "@/utils";
import Header from "./Header";

const CashBookRePort = () => {
  const { t } = useTranslation();
  const now = dayjs();
  const branch = useRecoilValue(branchStateSession);
  const branchName = branch?.name;
  return (
    <>
      <div className="my-6">
        <h1 className="text-center text-[28px] md:text-[36px] text-[#1A1A1A] font-semibold">
          Báo cáo sổ quỹ
        </h1>
        <h2 className="text-center text-[#333333]">
          <span>{t("viewReportAt")}</span>: {formatTime(now)}
        </h2>
        <h2 className="text-center text-[#333333]">
          <span>{t("branch")}</span>: {branchName}
        </h2>
      </div>

      <div className="card">
        <Header />
      </div>
    </>
  );
};

export default CashBookRePort;

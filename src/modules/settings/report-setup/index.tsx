import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import CustomActionHeader from "@/components/CustomActionHeader";
import { DatePicker } from "antd";
import Label from "@/components/CustomLabel";

const Report = () => {
  const { t } = useTranslation();

  return (
    <>
      <CustomActionHeader title="reportSetup" type="save" onSubmit={() => {}} />

      <div className="card flex flex-col gap-4">
        <div className="flex gap-2 flex-col">
          <h1 className="text-[#1a1a1a] text-[18px] uppercase font-semibold">
            Đặt thời gian chốt báo cáo
          </h1>

          <h1 className="text-[#666666] font-medium">
            Thời gian chốt báo cáo là thời gian ghi nhận báo cáo kết thúc một
            ngày bán hàng. Dữ liệu trong ngày sẽ được tổng hợp đến thời điểm này
          </h1>
        </div>

        <div className="w-full md:w-1/2">
          <Label label={t("time")} />
          <DatePicker
            placeholder="Nhập thời gian"
            onChange={() => {}}
            defaultValue={dayjs("00:00:00", "HH:mm:ss")}
            format="HH:mm:ss"
            picker="time"
            className="!h-11 w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Report;

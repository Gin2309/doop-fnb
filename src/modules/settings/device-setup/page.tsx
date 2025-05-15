import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Image from "next/image";

import CustomTable from "@/components/CustomTable";
import CustomActionHeader from "@/components/CustomActionHeader";

import { useRecoilValue } from "recoil";
import { branchStateSession } from "@/recoil/state";
import { CustomButton } from "@/components/CustomButton";

import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { ColumnsType } from "antd/es/table";

const data = [
  {
    id: "1",
    name: "DESKTOP-A5MQTAL",
    infor: "Doop Thu ngân",
    os: "Windows 10 Pro",
  },
  {
    id: "2",
    name: "Xprinter",
    infor: "Doop Máy in",
    os: "Windows 10 Pro",
  },
];

const Device = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const branch = useRecoilValue(branchStateSession);

  const columns: ColumnsType<any> = [
    {
      title: t("deviceInfor"),
      dataIndex: "name",
      key: "name",
      align: "start",
      render: (value, record) => (
        <div>
          <h1
            onClick={() => router.push(`/settings/device-setup/${record.id}`)}
            className="text-[#3355FF] cursor-pointer"
          >
            {value}
          </h1>
          <span className="text-[#666666] italic text-[12px]">{record.os}</span>
        </div>
      ),
    },
    {
      title: t("appInfor"),
      dataIndex: "infor",
      key: "infor",
      align: "start",
    },
  ];

  const CustomBtn = () => {
    return (
      <CustomButton
        type="primary"
        wrapClassName="mx-2"
        prefixIcon={<Image src={PlusIcon} />}
        onClick={() => router.push("/settings/device-setup/add-device")}
      >
        {t("addDevice")}
      </CustomButton>
    );
  };

  return (
    <>
      <div className="mx-8">
        <CustomActionHeader
          title="deviceList"
          type="custom"
          CustomBtn={CustomBtn}
        />

        <div className="card">
          <div className="flex gap-2 flex-col mb-4">
            <h1 className="text-[#1a1a1a] text-[18px] uppercase font-semibold">
              {t("deviceList")}
            </h1>
            <h1 className="text-[#666666] font-medium">
              Tổng hợp danh sách các thiết bị đang sử dụng phục vụ nhà hàng.
            </h1>
            <h1 className="text-[#666666] font-medium">
              Tổng số: {data.length} thiết bị
            </h1>
          </div>

          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            dataSource={data}
            columns={columns}
            rowClassName={() => "hover-row"}
            // loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Device;

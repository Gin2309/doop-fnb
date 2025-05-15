import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Title from "@/components/Title";
import Label from "@/components/CustomLabel";
import { Space, Input } from "antd";

import Search from "./Search";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import FileUpload from "@/components/CustomUpload/FileUpload";
import PartnerSelect from "../PartnerSelect";

import AddModal from "./AddModal";
import Table from "./Table";

const AddReceipt = ({
  title,
  dataSource,
}: {
  title: string;
  dataSource: any;
}) => {
  const { t } = useTranslation();
  const { TextArea } = Input;

  const [open, setOpen] = useState(false);

  const recieptTypeGroup = {
    data: {
      items: [
        { id: "1", name: t("byPercentage") },
        { id: "2", name: t("byPrice") },
      ],
    },
  };

  const partnerGroup = {
    data: {
      items: [
        { id: "1", name: "C Hằng đại lý rau" },
        { id: "2", name: "Kem Tràng Tiền" },
      ],
    },
  };

  return (
    <>
      <Title>{title}</Title>

      <div className="2xs:gap-4 md:gap-6 flex flex-col">
        <div className="card">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] uppercase ">
            {t("receiptInfo")}
          </h1>
          <div className="my-6 grid 2xs:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <Label infoText="" label={t("receiptType")} />
              <CustomSelect
                onChange={(value) => console.log(value)}
                options={recieptTypeGroup?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn loại phiếu nhập"
              />
            </div>

            <div>
              <Label infoText="" label={t("receiptCode")} />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                disabled
                placeholder="Mã sinh tự động nên để trống"
              />
            </div>

            <div>
              <Label infoText="" label={t("receiptName")} />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập tên phiếu"
              />
            </div>

            <div>
              <Label infoText="" label={t("documentFile")} />
              <FileUpload placeholder={t("uploadDocumentFile")} />
            </div>
          </div>
        </div>

        <div className="card">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] uppercase ">
            {t("itemIngredientInfo")}
          </h1>
          <div className="my-6 2xs:gap-4 md:gap-6">
            <Search />
            <Table dataSource={dataSource} />
          </div>
        </div>

        <div className="card">
          <h1 className="text-[#1a1a1a] font-semibold text-[20px] uppercase">
            {t("partnerInfo")}
          </h1>
          <div className="my-6 2xs:gap-4 md:gap-6">
            <Label infoText="" label={t("partner")} />
            <PartnerSelect
              partners={partnerGroup}
              onClick={() => setOpen(true)}
            />
          </div>
        </div>

        <div className="card">
          <Label infoText="" label={t("note")} />
          <TextArea
            rows={6}
            placeholder="Nhập ghi chú"
            style={{ borderRadius: "4px" }}
            // maxLength={100}
          />
        </div>
      </div>

      <AddModal
        isOpen={open}
        onCancel={() => setOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
};

export default AddReceipt;
